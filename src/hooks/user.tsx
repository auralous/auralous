import { useQuery } from "react-query";
import { useMeQuery, User, useUserFollowingsQuery } from "~/graphql/gql.gen";
import axios from "redaxios";
import { MAuth } from "~/types/index";

export function useCurrentUser(): User | null | undefined {
  const [{ data, fetching }] = useMeQuery();
  if (fetching) return undefined;
  return data?.me;
}

export function useMeFollowings() {
  const user = useCurrentUser();
  return useUserFollowingsQuery({
    variables: { id: user?.id || "" },
    pause: !user,
  });
}

export function useMAuth() {
  const user = useCurrentUser();
  return useQuery(
    `mauth:${user?.id || ""}`,
    async () => {
      const data = await axios
        .get<MAuth | undefined>(`${process.env.API_URI}/auth/mauth`, {
          withCredentials: true,
        })
        .then((res) => res.data);
      if (data?.expiredAt) data.expiredAt = new Date(data.expiredAt);
      return data || null;
    },
    { staleTime: 30 * 1000 * 1000 }
  );
}
