import type { TrackQuery, TrackQueryVariables } from "@auralous/api";
import { TrackDocument, useClient, useTracksQuery } from "@auralous/api";
import { useMemo } from "react";

/**
 * Shuffle by mutating the input arrays
 * @param arr
 * @returns
 */
export function shuffle<T>(arr: T[]): T[] {
  // https://bost.ocks.org/mike/shuffle/
  let m = arr.length;
  let t: T;
  let i: number;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

/**
 * Reorder an array without mutation
 * @param list
 * @param startIndex
 * @param endIndex
 * @returns
 */
export function reorder<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const uidForIndexedTrack = (trackIndex: number, trackId: string) =>
  `${trackIndex}${trackId}`;

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

export const externalTrackIdFromTrackId = (trackId: string) => {
  return trackId.split(":")[1];
};
