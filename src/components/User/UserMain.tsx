import React from "react";
import Link from "next/link";
import UserStory from "./UserStory";
import { useCurrentUser } from "~/hooks/user";
import { User, useStoriesQuery, useUserQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgSettings } from "~/assets/svg";

const UserMain: React.FC<{ initialUser: User }> = ({ initialUser }) => {
  const { t } = useI18n();
  // initialUser is the same as story, only might be a outdated version
  const [{ data }] = useUserQuery({
    variables: { id: initialUser.id },
  });
  const user = data?.user || initialUser;

  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: {
      creatorId: user.id,
    },
  });

  const me = useCurrentUser();

  return (
    <div className="max-w-xl mx-auto p-4 relative">
      <div className="h-12"></div>
      <div className="px-4 py-8">
        <img
          className="w-24 h-24 md:w-40 md:h-40 rounded-full mx-auto mb-2"
          src={user.profilePicture}
          alt={user.username}
        />
        <h1 className="text-lg md:text-2xl font-bold text-center">
          {user.username}
        </h1>
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
      {stories?.map((story) => (
        <UserStory key={story.id} story={story} />
      ))}
    </div>
  );
};

export default UserMain;
