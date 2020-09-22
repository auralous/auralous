import {
  useNowPlayingQuery,
  useOnNowPlayingUpdatedSubscription,
} from "~/graphql/gql.gen";

export default function useNowPlaying(
  resourceType?: string,
  resourceId?: string
) {
  const pause = !resourceId || !(resourceType === "room");
  const [res] = useNowPlayingQuery({
    variables: { id: `${resourceType}:${resourceId}` },
    pause,
    requestPolicy: "cache-and-network",
  });
  useOnNowPlayingUpdatedSubscription({
    variables: { id: `${resourceType}:${resourceId}` },
    pause,
  });

  return [res.data?.nowPlaying] as const;
}
