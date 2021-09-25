import { NotFoundScreen } from "@/components/NotFound";
import { useUserFollowersQuery, useUserQuery } from "@auralous/api";
import { LoadingScreen, SocialUserList } from "@auralous/ui";
import type { FC } from "react";
import type { RouteComponentProps } from "react-router";

export const UserFollowersScreen: FC<
  RouteComponentProps<{ username: string }>
> = ({ match }) => {
  const username = match.params.username;
  const [{ data: dataUser, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  const user = dataUser?.user;

  const [{ data, fetching: fetchingList }] = useUserFollowersQuery({
    variables: { id: user?.id || "" },
    pause: !user,
  });

  return fetching ? (
    <LoadingScreen />
  ) : user ? (
    <SocialUserList
      userIds={data?.userFollowers || null}
      fetching={fetchingList}
    />
  ) : (
    <NotFoundScreen />
  );
};
