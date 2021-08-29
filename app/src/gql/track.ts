import type { TrackQuery, TrackQueryVariables } from "@auralous/api";
import { TrackDocument, useClient, useTracksQuery } from "@auralous/api";
import { useMemo } from "react";

export const usePreloadedTrackQueries = (ids: string[]) => {
  const client = useClient();
  const unloadedIds = useMemo(() => {
    // These Object does not have data meaning they have not been loaded
    return ids.filter((id) => {
      return (
        client.readQuery<TrackQuery, TrackQueryVariables>(TrackDocument, {
          id,
        })?.data === undefined
      );
    });
  }, [ids, client]);
  const [{ fetching }] = useTracksQuery({
    variables: { ids: unloadedIds },
    pause: unloadedIds.length === 0,
  });
  return fetching;
};
