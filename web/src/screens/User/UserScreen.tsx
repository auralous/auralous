import { NotFoundScreen } from "@/components/NotFound";
import { useUserQuery } from "@auralous/api";
import { LoadingScreen, UserScreenContent } from "@auralous/ui";
import type { FC } from "react";
import type { RouteComponentProps } from "react-router";

export const UserScreen: FC<RouteComponentProps<{ username: string }>> = ({
  match,
}) => {
  const username = match.params.username;
  const [{ data, fetching }] = useUserQuery({
    variables: { username },
  });

  return fetching ? (
    <LoadingScreen />
  ) : data?.user ? (
    <UserScreenContent user={data.user} />
  ) : (
    <NotFoundScreen />
  );
};
