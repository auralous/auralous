import { useMemo } from "react";
import { useCrossTracksQuery, useTrackQuery } from "~/graphql/gql.gen";

export const useCrossTracks = (id?: string, pause?: boolean) => {
  const [
    {
      data: { crossTracks } = { crossTracks: undefined },
      fetching: fetchingCross,
    },
  ] = useCrossTracksQuery({
    variables: { id: id! },
    pause: pause || !id,
  });

  const [
    { data: { track: youtube } = { track: undefined }, fetching: fetchingYT },
  ] = useTrackQuery({
    variables: { id: `youtube:${crossTracks?.youtube}` },
    pause: !crossTracks?.youtube,
  });

  const [
    { data: { track: spotify } = { track: undefined }, fetching: fetchingS },
  ] = useTrackQuery({
    variables: { id: `spotify:${crossTracks?.spotify}` },
    pause: !crossTracks?.spotify,
  });

  const original = useMemo(() => {
    if (!crossTracks) return null;
    // Find the original tracks among crossTracks
    if (spotify?.id === crossTracks.id) return spotify;
    if (youtube?.id === crossTracks.id) return youtube;
    return null;
  }, [crossTracks, youtube, spotify]);

  const fetching = fetchingCross || fetchingYT || fetchingS;

  return [
    fetching || pause
      ? undefined
      : {
          id,
          original: original,
          youtube: crossTracks?.youtube && youtube,
          spotify: crossTracks?.spotify && spotify,
        },
    { fetching },
  ] as const;
};
