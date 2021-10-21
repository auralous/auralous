import { Config } from "@/config";
import { MAPBOX_STYLE_URL } from "@/utils/constants";
import type { MapViewProps } from "@react-native-mapbox-gl/maps";
import MapboxGL from "@react-native-mapbox-gl/maps";
import type { FC } from "react";
import { useCallback, useRef } from "react";
import { StyleSheet } from "react-native";
import { MapMapMarker } from "./MapMapMarker";
import type { MapMapProps } from "./types";

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export const MapMap: FC<MapMapProps> = ({ query, lngLat }) => {
  const ref = useRef<MapboxGL.MapView>(null);

  const onPress = useCallback<NonNullable<MapViewProps["onPress"]>>(
    async (feature) => {
      if (feature.geometry.type !== "Point" || !ref.current) return;
      const [lng, lat] = feature.geometry.coordinates;
      await query(lng, lat, await ref.current.getZoom());
    },
    [query]
  );

  return (
    <MapboxGL.MapView
      ref={ref}
      onPress={onPress}
      style={styles.root}
      styleURL={MAPBOX_STYLE_URL}
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
