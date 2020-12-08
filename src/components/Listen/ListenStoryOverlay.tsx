import React, { useMemo } from "react";
import Link from "next/link";
import { usePlayer } from "~/components/Player";
import { Story, useUserQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const ListenStoryOverlay: React.FC<{ storyFeed: Story[] | undefined }> = ({
  storyFeed,
}) => {
  const { t } = useI18n();
  const {
    state: { playingStoryId, playerPlaying },
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
      {playerPlaying && (
        <img
          alt={playerPlaying.title}
          src={playerPlaying.image}
          className="story-bg"
        />
      )}
      <div className="absolute z-10 px-2 py-4 bottom-0 w-full bg-gradient-to-t from-background to-transparent">
        <p className="text-sm text-foreground-secondary text-center mb-1">
          {t("listen.promptJoin", { username: user?.username })}
        </p>
        <Link href={`/story/${playingStory?.id}`}>
          <a className="btn btn-primary w-full">{t("listen.actionJoin")}</a>
        </Link>
      </div>
    </>
  );
};

export default ListenStoryOverlay;
