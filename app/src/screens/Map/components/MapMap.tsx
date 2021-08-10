import {
  StoriesOnMapDocument,
  StoriesOnMapQuery,
  StoriesOnMapQueryVariables,
  Story,
} from "@auralous/api";
import { toast } from "@auralous/ui";
import MapboxGL, { MapViewProps } from "@react-native-mapbox-gl/maps";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Config from "react-native-config";
import { OperationResult, useClient } from "urql";
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
  setStories(stories: Story[]): void;
}> = ({ setStories }) => {
  const { t } = useTranslation();

  const ref = useRef<MapboxGL.MapView>(null);
  const [lngLat, setLngLat] = useState<[lng: number, lat: number] | null>(null);

  const client = useClient();

  const onResult = useMemo(() => {
    let cosmeticDelay: ReturnType<typeof setTimeout>;
    return (result: OperationResult<StoriesOnMapQuery>) => {
      clearTimeout(cosmeticDelay);
      cosmeticDelay = setTimeout(() => {
        if (!result.data?.storiesOnMap.length) {
          toast(t("map.no_stories_found"));
        }
        setStories(result.data?.storiesOnMap || []);
        setLngLat(null);
      }, 2000);
    };
  }, [setStories, t]);

  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  const onPress = useCallback<NonNullable<MapViewProps["onPress"]>>(
    async (feature) => {
      if (feature.geometry.type !== "Point" || !ref.current) return;

      unsubscribeRef.current?.();

      const [lng, lat] = feature.geometry.coordinates;
      setLngLat([lng, lat]);

      unsubscribeRef.current = pipe(
        client.query<StoriesOnMapQuery, StoriesOnMapQueryVariables>(
          StoriesOnMapDocument,
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
