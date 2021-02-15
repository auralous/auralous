import { Me, useMeQuery, useUserFollowingsQuery } from "gql/gql.gen";

export function useMe(): Me | null | undefined {
  const [{ data, fetching }] = useMeQuery();
  if (fetching) return undefined;
  return data?.me;
}

export function useMeFollowings() {
  const me = useMe();
  return useUserFollowingsQuery({
    variables: { id: me?.user.id || "" },
    pause: !me,
  });
}
