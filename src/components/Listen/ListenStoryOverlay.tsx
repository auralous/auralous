import React, { useMemo } from "react";
import Link from "next/link";
import { useTransition, animated, config as springConfig } from "react-spring";
import ms from "ms";
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

  const dateStr = useMemo(() => {
    if (!playingStory) return "";
    return ms(Date.now() - playingStory.createdAt.getTime());
  }, [playingStory]);

  return (
    <>
      {transitionTop.map(({ key, props }) => (
        <animated.div
          key={key}
          className="z-10 absolute px-2 py-4"
          style={props}
        >
          <div className="flex">
            {user ? (
              <img
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover"
                src={user?.profilePicture}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-25" />
            )}
            <div className="p-1 leading-4">
              <div>
                <span className="font-semibold mr-2">{user?.username}</span>{" "}
                <span className="text-xs text-foreground-secondary">
                  {dateStr}
                </span>
              </div>
              <div className="text-sm text-foreground-secondary">
                {playingStory?.text}
              </div>
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
