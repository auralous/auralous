import {
  useNowPlayingQuery,
  useOnNowPlayingUpdatedSubscription,
} from "~/graphql/gql.gen";

export default function useNowPlaying(id: string) {
  const [res] = useNowPlayingQuery({
    variables: { id: id || "" },
    pause: !id,
    requestPolicy: "cache-and-network",
  });
  useOnNowPlayingUpdatedSubscription({
    variables: { id: id || "" },
    pause: !id,
  });

  return [id ? res.data?.nowPlaying : null, res] as const;
}
