import { useCurrentUserQuery, User } from "~/graphql/gql.gen";

export function useCurrentUser(): User | null | undefined {
  const [{ data, fetching }] = useCurrentUserQuery();
  if (fetching) return undefined;
  return data?.me;
}
