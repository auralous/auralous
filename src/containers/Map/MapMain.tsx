import mapboxgl from "mapbox-gl";
import Head from "next/head";
import { useEffect, useRef } from "react";

const mapBoxContainerId = "aura-map";

const MapMain: React.FC = () => {
  const mapRef = useRef(
    {} as { map: mapboxgl.Map; nav: mapboxgl.NavigationControl }
  );

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
