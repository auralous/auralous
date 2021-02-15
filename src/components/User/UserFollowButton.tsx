import { useLogin } from "components/Auth";
import { Button } from "components/Pressable";
import { useFollowUserMutation, useUnfollowUserMutation } from "gql/gql.gen";
import { useMe, useMeFollowings } from "hooks/user";
import { useI18n } from "i18n/index";

const UserFollowButton: React.FC<{ id: string; isTiny?: boolean }> = ({
  id,
  isTiny,
}) => {
  const { t } = useI18n();

  const me = useMe();
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
      <Button
        onPress={() => unfollowUser({ id })}
        disabled={fetchingUnfollow}
        color="primary"
        styling="link"
        size={isTiny ? "sm" : undefined}
        title={t("user.unfollow")}
        shape="circle"
      />
    );

  return (
    <Button
      onPress={() => (me ? followUser({ id }) : logIn())}
      disabled={fetchingFollow || me?.user.id === id}
      color="primary"
      size={isTiny ? "sm" : undefined}
      title={t("user.follow")}
      shape="circle"
    />
  );
};

export default UserFollowButton;
