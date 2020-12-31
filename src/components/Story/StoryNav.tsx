import React, { useMemo } from "react";
import Link from "next/link";
import ms from "ms";
import { useUserQuery, Story } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StoryNav: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId || "" },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  return (
    <div className="flex w-full">
      {user ? (
        <img
          alt={user.username}
          className="w-8 h-8 rounded-full object-cover"
          src={user.profilePicture}
        />
      ) : (
        <div className="box-skeleton w-8 h-8" />
      )}
      <div className="px-1 pt-0.5 w-0 flex-1 leading-4">
        <div className="whitespace-nowrap">
          <Link href={`/user/${user?.username}`}>
            <a className="text-inline-link font-semibold mr-1">
              {user?.username}
            </a>
          </Link>{" "}
          {story.isLive ? (
            <span className="font-semibold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <span className="text-xs text-foreground-secondary">{dateStr}</span>
          )}
        </div>
        <div className="text-sm text-foreground-secondary truncate">
          {story.text}
        </div>
      </div>
    </div>
  );
};

export default StoryNav;
