import { toast } from "@/components/Toast";
import type {
  Session,
  SessionsOnMapQuery,
  SessionsOnMapQueryVariables,
} from "@auralous/api";
import { SessionsOnMapDocument } from "@auralous/api";
import type { Dispatch, FC, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { OperationResult } from "urql";
import { useClient } from "urql";
import { pipe, subscribe } from "wonka";
import { MapMap } from "./MapMap";
import { radiusPx } from "./MapMapMarker";

// https://wiki.openstreetmap.org/wiki/Zoom_levels#Distance_per_pixel_math
function metersPerPixel(latitude: number, zoomLevel: number) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
}

const MapController: FC<{
  setSessions: Dispatch<SetStateAction<Session[]>>;
}> = ({ setSessions }) => {
  const { t } = useTranslation();

  const [lngLat, setLngLat] = useState<[lng: number, lat: number] | null>(null);
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
  useEffect(() => {
    return () => unsubscribeRef.current?.();
  }, []);

  const client = useClient();

  const query = useCallback(
    (lng: number, lat: number, zoom: number) => {
      unsubscribeRef.current?.();
      setLngLat([lng, lat]);
      unsubscribeRef.current = pipe(
        client.query<SessionsOnMapQuery, SessionsOnMapQueryVariables>(
          SessionsOnMapDocument,
          {
            lng: lng,
            lat: lat,
            radius: metersPerPixel(lat, zoom) * radiusPx,
          },
          { requestPolicy: "cache-and-network" }
        ),
        subscribe(onResult)
      ).unsubscribe;
    },
    [client, onResult]
  );

  return <MapMap query={query} lngLat={lngLat} />;
};

export default MapController;
