import { NotFoundScreen } from "@/components/NotFound";
import { useUserFollowingsQuery, useUserQuery } from "@auralous/api";
import { LoadingScreen, SocialUserList } from "@auralous/ui";
import type { FC } from "react";
import type { RouteComponentProps } from "react-router";

export const UserFollowingScreen: FC<
  RouteComponentProps<{ username: string }>
> = ({ match }) => {
  const username = match.params.username;
  const [{ data: dataUser, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  const user = dataUser?.user;

  const [{ data, fetching: fetchingList }] = useUserFollowingsQuery({
    variables: { id: user?.id || "" },
    pause: !user,
  });

  return fetching ? (
    <LoadingScreen />
  ) : user ? (
    <SocialUserList
      userIds={data?.userFollowings || null}
      fetching={fetchingList}
    />
  ) : (
    <NotFoundScreen />
  );
};
