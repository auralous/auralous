import React, { useCallback, useEffect, useState } from "react";
import { usePlayer } from "~/components/Player";
import { useI18n } from "~/i18n/index";
import {
  NowPlayingReactionType,
  Story,
  useNowPlayingReactionsQuery,
  useNowPlayingQuery,
  useReactNowPlayingMutation,
  useSkipNowPlayingMutation,
} from "~/graphql/gql.gen";
import { SvgHeart, SvgPause, SvgPlay, SvgSkipForward } from "~/assets/svg";
import { useCurrentUser } from "~/hooks/user";
import { toast } from "~/lib/toast";

const StoryReaction: React.FC<{ story: Story }> = ({ story }) => {
  const user = useCurrentUser();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: story.id } });

  const [
    { data: { nowPlayingReactions } = { nowPlayingReactions: undefined } },
  ] = useNowPlayingReactionsQuery({
    variables: { id: story.id },
    requestPolicy: "cache-and-network",
  });
  const [, reactNowPlaying] = useReactNowPlayingMutation();

  const react = useCallback(() => {
    if (user)
      reactNowPlaying({ id: story.id, reaction: NowPlayingReactionType.Heart });
    else toast.open({ type: "info", message: "Join to Add Your Reaction" });
  }, [story, reactNowPlaying, user]);

  return (
    <button
      className={`mx-2 flex flex-center w-10 h-10 rounded-full ${
        nowPlayingReactions?.mine ? "text-primary" : ""
      } opacity-100`}
      onClick={react}
      disabled={!(!!nowPlaying?.currentTrack && !nowPlayingReactions?.mine)}
    >
      <SvgHeart className="w-3 h-3 fill-current" />
    </button>
  );
};

const StorySkip: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const user = useCurrentUser();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: story.id } });

  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();

  return (
    <button
      className="mx-2 flex flex-center w-10 h-10 rounded-full"
      onClick={() => skipNowPlaying({ id: story.id })}
      disabled={
        fetching ||
        !nowPlaying?.currentTrack ||
        nowPlaying.currentTrack.creatorId !== user?.id
      }
      title={t("nowPlaying.skipSong")}
    >
      <SvgSkipForward className="w-3 h-3 fill-current" />
    </button>
  );
};

const StoryPlay: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const {
    player,
    state: { playingStoryId, playerPlaying },
    playStory,
  } = usePlayer();

  const [isPlaying, setIsPlaying] = useState(() => player.isPlaying);

  const storyPlayingStarted = playingStoryId === story.id;

  useEffect(() => {
    const onPlaying = () => setIsPlaying(true);
    const onPaused = () => setIsPlaying(false);
    player.on("playing", onPlaying);
    player.on("paused", onPaused);
    return () => {
      player.off("playing", onPlaying);
      player.off("paused", onPaused);
    };
  }, [player]);

  return (
    <button
      aria-label={isPlaying ? t("player.pause") : t("player.play")}
      className="mx-2 flex flex-center w-10 h-10 rounded-full bg-success text-white"
      onClick={() => {
        if (!storyPlayingStarted) return playStory(story.id);
        isPlaying ? player.pause() : player.play();
      }}
      disabled={!playerPlaying && storyPlayingStarted}
    >
      {isPlaying && storyPlayingStarted ? (
        <SvgPause className="w-3 h-3 fill-current" />
      ) : (
        <SvgPlay className="w-3 h-3 fill-current" />
      )}
    </button>
  );
};

const StoryFooter: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <div className="w-full fixed sm:absolute bottom-10 sm:bottom-0 h-16 flex flex-center py-2 bg-black">
      <StoryReaction story={story} />
      <StoryPlay story={story} />
      <StorySkip story={story} />
    </div>
  );
};

export default StoryFooter;
