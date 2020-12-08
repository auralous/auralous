import React, { useMemo } from "react";
import Link from "next/link";
import { useTransition, animated, config as springConfig } from "react-spring";
import { usePlayer } from "~/components/Player";
import { Story, useUserQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import StoryNav from "../Story/StoryNav";

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

  const transitionTop = useTransition(playingStory, null, {
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
      {transitionTop.map(({ key, props, item }) => (
        <animated.div key={key} className="z-10 absolute p-2" style={props}>
          {item && <StoryNav story={item} />}
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
      <div className="absolute z-10 px-2 py-4 bottom-0 w-full bg-gradient-to-t from-background to-transparent">
        <p className="text-sm text-foreground-secondary text-center mb-1">
          {t("listen.promptJoin", { username: user?.username || "" })}
        </p>
        <Link href={`/story/${playingStory?.id}`}>
          <a className="btn btn-primary w-full">{t("listen.actionJoin")}</a>
        </Link>
      </div>
    </>
  );
};

export default ListenStoryOverlay;
