import { useMemo } from "react";
import {
  Track,
  useCrossTracksQuery,
  useTrackQuery,
  PlatformName,
} from "~/graphql/gql.gen";

export const useCrossTracks = (id?: string, partial?: PlatformName) => {
  const [
    {
      data: { crossTracks } = { crossTracks: undefined },
      fetching: fetchingCross,
    },
  ] = useCrossTracksQuery({
    variables: { id: id || "" },
    pause: !id,
  });

  const [
    { data: { track: youtube } = { track: undefined }, fetching: fetchingYT },
  ] = useTrackQuery({
    variables: { id: `youtube:${crossTracks?.youtube}` },
    pause:
      !crossTracks?.youtube || (!!partial && partial !== PlatformName.Youtube),
  });

  const [
    { data: { track: spotify } = { track: undefined }, fetching: fetchingS },
  ] = useTrackQuery({
    variables: { id: `spotify:${crossTracks?.spotify}` },
    pause:
      !crossTracks?.spotify || (!!partial && partial !== PlatformName.Spotify),
  });

  const fetching = fetchingCross || fetchingYT || fetchingS;

  // TODO: Investigate while this returns differently on render
  const data = useMemo<
    | {
        id: string;
        original: Track | null;
        youtube: Track | null;
        spotify: Track | null;
      }
    | undefined
  >(() => {
    if (!id || !crossTracks || fetching) return undefined;

    // Find the original tracks among crossTracks
    let original: Track | null = null;
    if (spotify?.id === crossTracks.id) original = spotify;
    else if (youtube?.id === crossTracks.id) original = youtube;

    return { id, original, youtube: youtube || null, spotify: spotify || null };
  }, [id, fetching, crossTracks, youtube, spotify]);

  return [data, { fetching }] as const;
};
