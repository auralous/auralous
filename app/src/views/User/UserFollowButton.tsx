import { Button } from "@/components/Button";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import {
  useMeQuery,
  useUserFollowingsQuery,
  useUserFollowMutation,
  useUserUnfollowMutation,
} from "@auralous/api";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const UserFollowButton: FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();

  const uiDispatch = useUiDispatch();
  const onUnauthenticated = useCallback(
    () => uiDispatch({ type: "signIn", value: { visible: true } }),
    [uiDispatch]
  );

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

  if (me?.user.id === id) return null;

  return (
    <Button
      variant={followed ? undefined : "primary"}
      onPress={followed ? onUnfollow : onFollow}
      disabled={fetchingFollow || fetchingUnfollow}
      style={{ height: Size[8] }}
    >
      {followed ? t("user.unfollow") : t("user.follow")}
    </Button>
  );
};
