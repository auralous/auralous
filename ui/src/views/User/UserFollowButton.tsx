import { Button } from "@/components";
import {
  useMeQuery,
  useUserFollowingsQuery,
  useUserFollowMutation,
  useUserUnfollowMutation,
} from "@auralous/api";
import { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const UserFollowButton: FC<{ id: string; onUnauthenticated(): void }> =
  ({ id, onUnauthenticated }) => {
    const { t } = useTranslation();

    const [{ data: { me } = { me: undefined } }] = useMeQuery();

    const [{ data: { userFollowings } = { userFollowings: undefined } }] =
      useUserFollowingsQuery({
        variables: { id: me?.user.id || "" },
        pause: !me,
      });

    const followed = useMemo(
      () => Boolean(userFollowings?.includes(id)),
      [userFollowings, id]
    );

    const [{ fetching: fetchingFollow }, followUser] = useUserFollowMutation();
    const [{ fetching: fetchingUnfollow }, unfollowUser] =
      useUserUnfollowMutation();

    const onUnfollow = useCallback(
      () => unfollowUser({ id }),
      [unfollowUser, id]
    );

    const onFollow = useCallback(
      () => (me ? followUser({ id }) : onUnauthenticated()),
      [me, followUser, onUnauthenticated, id]
    );

    return (
      <Button
        variant={followed ? undefined : "primary"}
        onPress={followed ? onUnfollow : onFollow}
        disabled={fetchingFollow || fetchingUnfollow || me?.user.id === id}
      >
        {followed ? t("user.unfollow") : t("user.follow")}
      </Button>
    );
  };
