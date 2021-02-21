import { SvgSettings } from "assets/svg";
import { Modal, useModal } from "components/Modal";
import { Button, PressableHighlight } from "components/Pressable";
import { Spacer } from "components/Spacer";
import StoryFeed from "components/Story/StoryFeed";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  User,
  useUserFollowersQuery,
  useUserFollowingsQuery,
  useUserQuery,
  useUserStatQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import Link from "next/link";
import { useEffect } from "react";
import UserFollowButton from "./UserFollowButton";
import UserList from "./UserList";

const UserFollowingModals: React.FC<{
  id: string;
  active: boolean;
  close(): void;
}> = ({ id, active, close }) => {
  const { t } = useI18n();

  const [
    { data: { userFollowings } = { userFollowings: undefined } },
  ] = useUserFollowingsQuery({
    variables: { id },
    pause: !active,
    requestPolicy: "cache-and-network",
  });

  return (
    <Modal.Modal title={t("user.following")} active={active} close={close}>
      <Modal.Header>
        <Modal.Title>{t("user.following")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <UserList userIds={userFollowings || []} />
      </Modal.Content>
    </Modal.Modal>
  );
};

const UserFollowerModals: React.FC<{
  id: string;
  active: boolean;
  close(): void;
}> = ({ id, active, close }) => {
  const { t } = useI18n();

  const [
    { data: { userFollowers } = { userFollowers: undefined } },
  ] = useUserFollowersQuery({
    variables: { id },
    pause: !active,
    requestPolicy: "cache-and-network",
  });

  return (
    <Modal.Modal title={t("user.followers")} active={active} close={close}>
      <Modal.Header>
        <Modal.Title>{t("user.followers")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <UserList userIds={userFollowers || []} />
      </Modal.Content>
    </Modal.Modal>
  );
};

const UserMain: React.FC<{ initialUser: User }> = ({ initialUser }) => {
  const { t } = useI18n();
  // initialUser is the same as story, only might be a outdated version
  const [{ data }] = useUserQuery({
    variables: { id: initialUser.id },
  });
  const user = data?.user || initialUser;

  const me = useMe();

  const [{ data: { userStat } = { userStat: undefined } }] = useUserStatQuery({
    variables: { id: user.id },
    requestPolicy: "cache-and-network",
  });

  const [activeFollower, openFollower, closeFollower] = useModal();
  const [activeFollowing, openFollowing, closeFollowing] = useModal();

  useEffect(() => {
    closeFollower();
    closeFollowing();
  }, [initialUser.id, closeFollower, closeFollowing]);

  return (
    <>
      <div className="relative px-4 pt-8 pb-4">
        <img
          className="w-28 h-28 rounded-full mx-auto"
          src={user.profilePicture}
          alt={user.username}
        />
        <Spacer size={2} axis="vertical" />
        <Typography.Title size="xl" strong align="center">
          {user.username}
        </Typography.Title>
        <div className="text-center">
          <UserFollowButton id={user.id} />
        </div>
        <Spacer size={8} axis="vertical" />
        <Box justifyContent="center" row>
          <PressableHighlight onPress={openFollowing} shape="circle">
            <Typography.Text strong color="foreground-secondary">
              {userStat?.followingCount}
            </Typography.Text>
            <Spacer size={1} axis="horizontal" />
            <Typography.Text color="foreground-secondary">
              {t("user.following")}
            </Typography.Text>
          </PressableHighlight>
          <Spacer size={8} axis="horizontal" />
          <PressableHighlight onPress={openFollower} shape="circle">
            <Typography.Text strong color="foreground-secondary">
              {userStat?.followerCount}
            </Typography.Text>
            <Spacer size={1} axis="horizontal" />
            <Typography.Text color="foreground-secondary">
              {t("user.followers")}
            </Typography.Text>
          </PressableHighlight>
        </Box>
        <div className="flex flex-center text-sm space-x-8 text-foreground-secondary"></div>
        {me?.user.id === user.id && (
          <div className="md:hidden absolute top-2 right-0">
            <Link href="/settings">
              <Button
                styling="link"
                icon={<SvgSettings className="w-8 h-8 stroke-1" />}
                accessibilityLabel={t("settings.title")}
              />
            </Link>
          </div>
        )}
      </div>
      <div className="py-4">
        <StoryFeed id={`creatorId:${user.id}`} />
      </div>
      <UserFollowingModals
        id={user.id}
        active={activeFollowing}
        close={closeFollowing}
      />
      <UserFollowerModals
        id={user.id}
        active={activeFollower}
        close={closeFollower}
      />
    </>
  );
};

export default UserMain;
