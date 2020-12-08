import React, { useMemo } from "react";
import Link from "next/link";
import { useTransition, animated, config as springConfig } from "react-spring";
import { usePlayer } from "~/components/Player";
import { Story, useStoryStateQuery, useUserQuery } from "~/graphql/gql.gen";
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

  const [
    { data: { storyState } = { storyState: undefined } },
  ] = useStoryStateQuery({
    variables: { id: playingStory?.id || "" },
    pause: !playingStory,
  });

  const transitionTop = useTransition(playingStoryId, null, {
    from: { opacity: 0, top: "-1rem" },
    enter: { opacity: 1, top: "0rem" },
    leave: { opacity: 0, top: "-1rem" },
    config: springConfig.slow,
  });

  const transitionImage = useTransition(playerPlaying?.image, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig.slow,
  });

  return (
    <>
      {transitionTop.map(({ key, props }) => (
        <animated.div
          key={key}
          className="absolute flex px-2 py-4"
          style={props}
        >
          <img
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover"
            src={user?.profilePicture}
          />
          <div className="p-1 leading-4">
            <div className="font-semibold">{user?.username}</div>
            <div className="text-xs text-foreground-secondary">
              {storyState?.userIds.length} {t("story.listeners.title")}
            </div>
          </div>
        </animated.div>
      ))}
      {transitionImage.map(
        ({ item, key, props }) =>
          item && (
            <animated.img
              style={props}
              key={key}
              alt={t("nowPlaying.title")}
              src={item}
              className="story-bg"
            />
          )
      )}
      {playerPlaying && (
        <img
          alt={t("nowPlaying.title")}
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
