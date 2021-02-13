import { useOnQueueUpdatedSubscription, useQueueQuery } from "gql/gql.gen";

export default function useQueue(queueId: string, skipSubscribing?: boolean) {
  const [res] = useQueueQuery({
    variables: { id: queueId },
    requestPolicy: "cache-and-network",
  });
  useOnQueueUpdatedSubscription({
    variables: { id: queueId },
    pause: !res.data?.queue || skipSubscribing,
  });
  return [res.data?.queue, res] as const;
}
