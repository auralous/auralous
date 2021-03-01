import mapboxgl from "mapbox-gl";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const mapBoxContainerId = "aura-map";

const MapMain: React.FC = () => {
  const [lngLat, setLngLat] = useState<mapboxgl.LngLat | null>(null);
  const mapRef = useRef(
    {} as {
      map: mapboxgl.Map;
      nav: mapboxgl.NavigationControl;
      marker: mapboxgl.Marker | undefined;
    }
  );

  useEffect(() => {
    if (!lngLat) return;
    const map = mapRef.current.map;
    // marker icon
    const markerEl = document.createElement("div");

    for (let i = 0; i < 3; i += 1) {
      // add three bubble incrementally into el
      const bubble = document.createElement("div");
      bubble.className =
        "absolute -top-6 -left-6 w-12 h-12 bg-white rounded-full opacity-50 animate-ping";

      window.setTimeout(() => {
        markerEl.appendChild(bubble);
      }, i * 275);
    }

    // marker
    const marker = (mapRef.current.marker = new mapboxgl.Marker(markerEl)
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(map));
    return () => {
      marker.remove();
      mapRef.current.marker = undefined;
      markerEl.remove();
      // TODO: remove children?
    };
  }, [lngLat]);

  useEffect(() => {
    const map = (mapRef.current.map = new mapboxgl.Map({
      accessToken: process.env.MAPBOX_ACCESS_TOKEN,
      container: mapBoxContainerId,
      style: process.env.MAPBOX_STYLE,
    }));
    const nav = (mapRef.current.nav = new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
      visualizePitch: false,
    }));
    map.addControl(nav, "bottom-right");
    const onMapClick = (ev: mapboxgl.MapMouseEvent) => {
      setLngLat(ev.lngLat);
    };
    map.on("click", onMapClick);
    return () => {
      map.off("click", onMapClick);
      map.remove();
    };
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div className="absolute inset-0 w-full h-full" id={mapBoxContainerId} />
    </>
  );
};

export default MapMain;
