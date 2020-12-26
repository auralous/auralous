import React, { useMemo } from "react";
import Link from "next/link";
import { usePlayer } from "~/components/Player";
import { Story, useUserQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySliderAction: React.FC<{ storyFeed: Story[] | undefined }> = ({
  storyFeed,
}) => {
  const { t } = useI18n();
  const {
    state: { playingStoryId },
  } = usePlayer();

  const playingStory = useMemo<Story | null>(
    () =>
      (playingStoryId && storyFeed?.find((s) => s.id === playingStoryId)) ||
      null,
    [playingStoryId, storyFeed]
  );

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: playingStory?.creatorId || "" },
    pause: !playingStory,
  });

  return (
    <>
      <div className="px-2 py-4 absolute z-10 bottom-0 w-full">
        <p className="text-lg text-foreground-secondary text-center mb-1">
          {t(
            playingStory?.isLive
              ? "listen.promptJoin"
              : "listen.promptJoinNolive",
            { username: user?.username || "" }
          )}
        </p>
        <Link href={`/story/${playingStory?.id}`}>
          <a className="btn btn-primary w-full">
            {playingStory?.isLive
              ? t("listen.actionJoin")
              : t("listen.actionJoinNoLive")}
          </a>
        </Link>
      </div>
    </>
  );
};

export default StorySliderAction;
