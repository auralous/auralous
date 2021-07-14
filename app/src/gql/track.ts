import {
  TrackDocument,
  TrackQuery,
  TrackQueryVariables,
  useTracksQuery,
} from "@auralous/api";
import { useMemo } from "react";
import { useClient } from "urql";

export const usePreloadedTrackQueries = (ids: string[]) => {
  const client = useClient();
  const unloadedIds = useMemo(() => {
    return ids.filter((id) => {
      return !!client.readQuery<TrackQuery, TrackQueryVariables>(
        TrackDocument,
        { id }
      );
    });
  }, [ids, client]);
  const [{ fetching }] = useTracksQuery({ variables: { ids: unloadedIds } });
  return fetching;
};
