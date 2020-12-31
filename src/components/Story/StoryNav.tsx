import React, { useMemo } from "react";
import ms from "ms";
import { useUserQuery, Story } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgChevronDown, SvgMoreHorizontal } from "~/assets/svg";

const StoryNav: React.FC<{ story: Story; onClose: () => void }> = ({
  story,
  onClose,
}) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId || "" },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  return (
    <div className="flex items-center justify-between">
      <button
        className="btn btn-transparent p-0 w-8 h-8"
        onClick={onClose}
        aria-label={t("modal.close")}
      >
        <SvgChevronDown className="w-6 h-6" />
      </button>
      <div className="flex w-0 flex-1 items-center justify-center">
        {user ? (
          <img
            alt={user.username}
            className="w-6 h-6 rounded-full object-cover"
            src={user.profilePicture}
          />
        ) : (
          <div className="box-skeleton w-6 h-6" />
        )}
        <div className="whitespace-nowrap ml-1">
          <span className="text-sm font-semibold">
            {t("story.ofUsername", { username: user?.username || "" })}
          </span>{" "}
          {story.isLive ? (
            <span className="font-semibold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <span className="text-xs text-foreground-secondary">{dateStr}</span>
          )}
        </div>
      </div>
      <button className="btn btn-transparent p-0 w-8 h-8">
        <SvgMoreHorizontal className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StoryNav;
