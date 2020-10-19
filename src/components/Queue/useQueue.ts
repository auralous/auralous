import {
  useQueueQuery,
  useOnQueueUpdatedSubscription,
} from "~/graphql/gql.gen";

export default function useQueue(queueId: string) {
  const [res] = useQueueQuery({
    variables: { id: queueId as string },
  });
  useOnQueueUpdatedSubscription({
    variables: { id: queueId as string },
    pause: !res.data?.queue,
  });
  return [res.data?.queue, res] as const;
}
