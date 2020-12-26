import { Story, useUserQuery } from "~/graphql/gql.gen";

import React, { useMemo } from "react";
import ms from "ms";
import { useI18n } from "~/i18n/index";

const StoryItem: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  return (
    <div
      className="w-full relative h-0 bg-background-secondary rounded-lg"
      style={{ paddingBottom: "100%" }}
    >
      <div className="border-4 border-background-tertiary w-12 h-12 rounded-full overflow-hidden absolute top-4 left-4">
        {user ? (
          <img
            alt={user.username}
            className="w-full h-full object-cover"
            src={user.profilePicture}
          />
        ) : (
          <div className="box-skeleton w-full h-full" />
        )}
      </div>
      <div className="absolute p-4 bottom-0 w-full">
        <div>
          <span className="font-bold mr-1">{user?.username}</span>
          {story.isLive ? (
            <span className="font-semibold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <span className="text-xs text-foreground-secondary">{dateStr}</span>
          )}
        </div>
        <div className="text-foreground-secondary">{story.text}</div>
      </div>
    </div>
  );
};

export default StoryItem;
