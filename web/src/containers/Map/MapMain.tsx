import {
  StoriesOnMapDocument,
  StoriesOnMapQuery,
  StoriesOnMapQueryVariables,
  Story,
} from "gql/gql.gen";
import { t as tFn } from "i18n";
import mapboxgl from "mapbox-gl";
import Head from "next/head";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { OperationResult, useClient } from "urql";
import { pipe, subscribe } from "wonka";

const mapBoxContainerId = "aura-map";

// https://wiki.openstreetmap.org/wiki/Zoom_levels#Distance_per_pixel_math
function metersPerPixel(latitude: number, zoomLevel: number) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
}

const radiusPx = 24;

const MapMain: React.FC<{
  setStories: Dispatch<SetStateAction<Story[]>>;
}> = ({ setStories }) => {
  const [lngLat, setLngLat] = useState<mapboxgl.LngLat | null>(null);
  // Pagination: currently not used

  const mapRef = useRef(
    {} as {
      map: mapboxgl.Map;
      nav: mapboxgl.NavigationControl;
      marker: mapboxgl.Marker | undefined;
    }
  );

  const client = useClient();

  const onResult = useMemo(() => {
    let to: number;
    return (result: OperationResult<StoriesOnMapQuery>) => {
      window.clearTimeout(to);
      to = window.setTimeout(() => {
        setLngLat(null);
        if (!result.data) return;
        if (!result.data.storiesOnMap.length) {
          toast(tFn("map.query.noStories"));
        } else {
          setStories(result.data.storiesOnMap);
        }
      }, 2000);
    };
  }, [setStories]);

  useEffect(() => {
    if (!lngLat) return;

    const map = mapRef.current.map;
    // marker icon
    const markerEl = document.createElement("div");

    for (let i = 0; i < 3; i += 1) {
      // add three bubble incrementally into el
      const bubble = document.createElement("div");
      bubble.className =
        "absolute bg-white rounded-full opacity-50 animate-ping";
      bubble.style.width = bubble.style.height = radiusPx * 2 + "px";
      bubble.style.top = bubble.style.left = -radiusPx + "px";

      window.setTimeout(() => {
        markerEl.appendChild(bubble);
      }, i * 275);
    }

    // marker
    const marker = (mapRef.current.marker = new mapboxgl.Marker(markerEl)
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(map));

    const { unsubscribe } = pipe(
      client.query<StoriesOnMapQuery, StoriesOnMapQueryVariables>(
        StoriesOnMapDocument,
        {
          lng: lngLat.lng,
          lat: lngLat.lat,
          radius: metersPerPixel(lngLat.lat, map.getZoom()) * radiusPx,
        }
      ),
      subscribe(onResult)
    );

    return () => {
      unsubscribe();
      marker.remove();
      markerEl.remove();
      // TODO: remove children?
    };
  }, [client, lngLat, onResult]);

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
