import React from "react";
import { useCurrentUser, useMeFollowings } from "~/hooks/user";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const UserFollowButton: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();

  const user = useCurrentUser();

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
        className="btn btn-transparent text-primary bg-transparent border-2 border-primary text-sm rounded-full"
      >
        {t("user.unfollow")}
      </button>
    );

  return (
    <button
      onClick={() => followUser({ id })}
      disabled={fetchingFollow || user?.id === id}
      className="btn btn-primary border-2 border-transparent text-sm rounded-full"
    >
      {t("user.follow")}
    </button>
  );
};

export default UserFollowButton;
