import { Config } from "@/config";
import { MAPBOX_STYLE_URL } from "@/utils/constants";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FC } from "react";
import { useEffect, useRef } from "react";
// @ts-ignore
import { render } from "react-native-web";
import { MapMapMarker } from "./MapMapMarker";
import type { MapMapProps } from "./types";

mapboxgl.accessToken = Config.MAPBOX_ACCESS_TOKEN;

export const MapMap: FC<MapMapProps> = ({ lngLat, query }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

  useEffect(() => {
    let mapInst = map.current;
    if (!mapInst) {
      if (!mapContainer.current) return;
      mapInst = map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_STYLE_URL,
        bounds: [
          [-117, -80],
          [174, 79],
        ],
      });
      const nav = new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
        visualizePitch: false,
      });
      mapInst.addControl(nav, "bottom-right");
    }
    const onMapClick = (ev: mapboxgl.MapMouseEvent) => {
      query(ev.lngLat.lng, ev.lngLat.lat, mapInst?.getZoom() || 1);
    };
    mapInst.on("click", onMapClick);
    return () => {
      mapInst?.off("click", onMapClick);
    };
  }, [query]);

  useEffect(() => {
    if (!lngLat) return;
    const mapInst = map.current;
    if (!mapInst) return;
    const markerEl = document.createElement("div");
    markerEl.style.display = "inline-block";
    render(<MapMapMarker lngLat={lngLat} />, markerEl);
    // marker

    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat({ lng: lngLat[0], lat: lngLat[1] })
      .addTo(mapInst);
    return () => {
      marker.remove();
      markerEl.remove();
    };
  }, [lngLat]);

  // eslint-disable-next-line react-native/no-inline-styles
  return <div id="map" style={{ flex: "1 1 0%" }} ref={mapContainer} />;
};
