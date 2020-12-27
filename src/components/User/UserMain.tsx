import React from "react";
import Link from "next/link";
import UserFollowButton from "./UserFollowButton";
import StoryFeed from "~/components/Story/StoryFeed";
import { useCurrentUser } from "~/hooks/user";
import { User, useUserQuery, useUserStatQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgSettings } from "~/assets/svg";

const UserMain: React.FC<{ initialUser: User }> = ({ initialUser }) => {
  const { t } = useI18n();
  // initialUser is the same as story, only might be a outdated version
  const [{ data }] = useUserQuery({
    variables: { id: initialUser.id },
  });
  const user = data?.user || initialUser;

  const me = useCurrentUser();

  const [{ data: { userStat } = { userStat: undefined } }] = useUserStatQuery({
    variables: { id: user.id },
    requestPolicy: "cache-and-network",
  });

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
          <div>
            <b>{userStat?.followingCount}</b> {t("user.following")}
          </div>
          <div>
            <b>{userStat?.followerCount}</b> {t("user.followers")}
          </div>
        </div>
        {me?.id === user.id && (
          <Link href="/settings">
            <a
              className="sm:hidden absolute top-2 right-0 btn btn-transparent"
              title={t("settings.title")}
            >
              <SvgSettings className="w-8 h-8 stroke-1" />
            </a>
          </Link>
        )}
      </div>
      <div className="container mx-auto py-4">
        <StoryFeed id={`creatorId:${user.id}`} />
      </div>
    </>
  );
};

export default UserMain;
