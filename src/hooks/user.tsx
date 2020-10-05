import { useQuery } from "react-query";
import { useCurrentUserQuery, User } from "~/graphql/gql.gen";
import axios from "redaxios";
import { MAuth } from "../types";

export function useCurrentUser(): User | null | undefined {
  const [{ data, fetching }] = useCurrentUserQuery();
  if (fetching) return undefined;
  return data?.me;
}

export function useMAuth() {
  return useQuery(`mauth`, async () => {
    const data = axios
      .get<MAuth | undefined>(`${process.env.API_URI}/auth/mauth`, {
        withCredentials: true,
      })
      .then((res) => res.data);
    return data || null;
  });
}
