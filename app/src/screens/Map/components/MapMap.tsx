import { toast } from "@/components/Toast";
import { Config } from "@/utils/constants";
import type {
  Session,
  SessionsOnMapQuery,
  SessionsOnMapQueryVariables,
} from "@auralous/api";
import { SessionsOnMapDocument, useClient } from "@auralous/api";
import type { MapViewProps } from "@react-native-mapbox-gl/maps";
import MapboxGL from "@react-native-mapbox-gl/maps";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import type { OperationResult } from "urql";
import { pipe, subscribe } from "wonka";
import { MapMapMarker, radiusPx } from "./MapMapMarker";

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

// https://wiki.openstreetmap.org/wiki/Zoom_levels#Distance_per_pixel_math
function metersPerPixel(latitude: number, zoomLevel: number) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
}

export const MapMap: FC<{
  setSessions(sessions: Session[]): void;
}> = ({ setSessions }) => {
  const { t } = useTranslation();

  const ref = useRef<MapboxGL.MapView>(null);
  const [lngLat, setLngLat] = useState<[lng: number, lat: number] | null>(null);

  const client = useClient();

  const onResult = useMemo(() => {
    let cosmeticDelay: ReturnType<typeof setTimeout>;
    return (result: OperationResult<SessionsOnMapQuery>) => {
      clearTimeout(cosmeticDelay);
      cosmeticDelay = setTimeout(() => {
        if (!result.data?.sessionsOnMap.length) {
          toast(t("map.no_sessions_found"));
        }
        setSessions(result.data?.sessionsOnMap || []);
        setLngLat(null);
      }, 2000);
    };
  }, [setSessions, t]);

  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  const onPress = useCallback<NonNullable<MapViewProps["onPress"]>>(
    async (feature) => {
      if (feature.geometry.type !== "Point" || !ref.current) return;

      unsubscribeRef.current?.();

      const [lng, lat] = feature.geometry.coordinates;
      setLngLat([lng, lat]);

      unsubscribeRef.current = pipe(
        client.query<SessionsOnMapQuery, SessionsOnMapQueryVariables>(
          SessionsOnMapDocument,
          {
            lng: lng,
            lat: lat,
            radius: metersPerPixel(lat, await ref.current.getZoom()) * radiusPx,
          },
          { requestPolicy: "cache-and-network" }
        ),
        subscribe(onResult)
      ).unsubscribe;
    },
    [client, onResult]
  );

  useEffect(() => {
    return () => unsubscribeRef.current?.();
  }, []);

  return (
    <MapboxGL.MapView
      ref={ref}
      onPress={onPress}
      style={styles.root}
      styleURL={Config.MAPBOX_STYLE_URL}
    >
      <MapboxGL.Camera />
      {lngLat && (
        <MapboxGL.MarkerView id="marker" coordinate={lngLat} draggable={false}>
          <MapMapMarker lngLat={lngLat} />
        </MapboxGL.MarkerView>
      )}
    </MapboxGL.MapView>
  );
};
