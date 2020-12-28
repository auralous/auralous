import React from "react";
import { useLogin } from "~/components/Auth";
import { useCurrentUser, useMeFollowings } from "~/hooks/user";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const UserFollowButton: React.FC<{ id: string; isTiny?: boolean }> = ({
  id,
  isTiny,
}) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const [, logIn] = useLogin();

  const [
    { data: { userFollowings } = { userFollowings: undefined } },
  ] = useMeFollowings();

  const [{ fetching: fetchingFollow }, followUser] = useFollowUserMutation();
  const [
    { fetching: fetchingUnfollow },
    unfollowUser,
  ] = useUnfollowUserMutation();

  const followed = userFollowings?.includes(id);

  if (followed)
    return (
      <button
        onClick={() => unfollowUser({ id })}
        disabled={fetchingUnfollow}
        className={`btn btn-transparent text-primary bg-transparent border-2 border-primary rounded-full leading-none ${
          isTiny ? "text-xs px-2 py-1" : "text-sm"
        }`}
      >
        {t("user.unfollow")}
      </button>
    );

  return (
    <button
      onClick={() => (user ? followUser({ id }) : logIn())}
      disabled={fetchingFollow || user?.id === id}
      className={`btn btn-primary border-2 border-transparent rounded-full leading-none ${
        isTiny ? "text-xs px-2 py-1" : "text-sm"
      }`}
    >
      {t("user.follow")}
    </button>
  );
};

export default UserFollowButton;
