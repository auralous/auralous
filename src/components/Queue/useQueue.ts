import { UseQueryArgs } from "urql";
import {
  useQueueQuery,
  useOnQueueUpdatedSubscription,
} from "~/graphql/gql.gen";

export default function useQueue(
  queueId: string,
  queryOpts?: Partial<
    UseQueryArgs<{
      id: string;
    }>
  >
) {
  const [res] = useQueueQuery({
    variables: { id: queueId as string },
    ...queryOpts,
  });
  useOnQueueUpdatedSubscription({
    variables: { id: queueId as string },
    pause: !res.data?.queue,
  });
  return [res.data?.queue, res] as const;
}
