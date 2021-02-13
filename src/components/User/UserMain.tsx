import { SvgSettings } from "assets/svg";
import { Button } from "components/Button";
import { Modal, useModal } from "components/Modal";
import StoryFeed from "components/Story/StoryFeed";
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
import React from "react";
import { onEnterKeyClick } from "utils/util";
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

  return (
    <>
      <div
        className="relative px-4 pt-8 pb-4 border-b-4 border-primary"
        style={{
          backgroundColor: "rgb(18, 18, 24)",
        }}
      >
        <img
          className="w-28 h-28 rounded-full mx-auto mb-2"
          src={user.profilePicture}
          alt={user.username}
        />
        <h1 className="text-lg md:text-2xl font-bold text-center mb-2">
          {user.username}
        </h1>
        <div className="text-center mb-8">
          <UserFollowButton id={user.id} />
        </div>
        <div className="flex flex-center text-sm space-x-8 text-foreground-secondary">
          <div
            role="link"
            tabIndex={0}
            onKeyPress={onEnterKeyClick}
            className="p-1 text-inline-link"
            onClick={openFollowing}
          >
            <b>{userStat?.followingCount}</b> {t("user.following")}
          </div>
          <div
            role="link"
            tabIndex={0}
            onKeyPress={onEnterKeyClick}
            className="p-1 text-inline-link"
            onClick={openFollower}
          >
            <b>{userStat?.followerCount}</b> {t("user.followers")}
          </div>
        </div>
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
