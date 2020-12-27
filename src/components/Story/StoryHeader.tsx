import React, { useMemo, useCallback, useEffect } from "react";
import { animated } from "react-spring";
import { usePlayer } from "~/components/Player/index";
import { useModal } from "~/components/Modal/index";
import {
  NowPlayingReactionType,
  Story,
  Track,
  useNowPlayingQuery,
  useNowPlayingReactionsQuery,
  useReactNowPlayingMutation,
} from "~/graphql/gql.gen";
import { TrackMenu } from "~/components/Track";
import QueueAddedBy from "~/components/Queue/QueueAddedBy";
import { useCurrentUser } from "~/hooks/user";
import { useBoop } from "~/hooks/animation";
import { toast } from "~/lib/toast";
import { useI18n } from "~/i18n/index";
import { SvgHeart } from "~/assets/svg";

const AnimatedSvgHeart = animated(SvgHeart);

const StoryReaction: React.FC<{ story: Story }> = ({ story }) => {
  // We are only using HEART reaction right now
  const user = useCurrentUser();

  const [
    { data: { nowPlayingReactions } = { nowPlayingReactions: undefined } },
    refetchingNowPlayingReactions,
  ] = useNowPlayingReactionsQuery({
    variables: { id: story.id },
    requestPolicy: "cache-and-network",
  });

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: story.id } });

  useEffect(refetchingNowPlayingReactions, [
    nowPlaying,
    refetchingNowPlayingReactions,
  ]);

  const [animatedStyles, triggerAnimated] = useBoop({
    rotation: 20,
    scale: 1.1,
  });

  const [, reactNowPlaying] = useReactNowPlayingMutation();

  useEffect(triggerAnimated, [nowPlayingReactions, triggerAnimated]);

  const reacted = useMemo<boolean>(
    () =>
      !!user && !!nowPlayingReactions?.some((npr) => npr.userId === user.id),
    [user, nowPlayingReactions]
  );

  const react = useCallback(() => {
    if (reacted) return;
    if (user)
      reactNowPlaying({ id: story.id, reaction: NowPlayingReactionType.Heart });
    else toast.open({ type: "info", message: "Join to Add Your Reaction" });
  }, [story, reactNowPlaying, user, reacted]);

  return (
    <button
      className="btn flex-col btn-transparent p-2 flex flex-center rounded-full"
      onClick={react}
      disabled={!nowPlaying?.currentTrack}
    >
      <AnimatedSvgHeart
        className={`w-6 h-6 ${reacted ? "text-primary fill-current" : ""}`}
        style={animatedStyles}
      />
      <span className="text-xs font-mono">
        {nowPlayingReactions?.length || 0}
      </span>
    </button>
  );
};

const NowPlayingMeta: React.FC<{
  storyId: string;
  track: Track | null | undefined;
}> = ({ storyId, track }) => {
  const { t } = useI18n();
  const {
    state: { fetching, playingStoryId },
  } = usePlayer();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: storyId } });

  const storyPlayingStarted = playingStoryId === storyId;
  const [activeMenu, openMenu, closeMenu] = useModal();

  return (
    <>
      <div className="mb-1 flex flex-col items-start">
        <div className="truncate text-foreground-secondary text-xs max-w-full">
          {storyPlayingStarted ? (
            fetching ? (
              <div className="block-skeleton rounded h-3 w-32" />
            ) : track ? (
              <>
                {track.artists.map(({ name }) => name).join(", ")}
                {nowPlaying?.currentTrack && (
                  <>
                    {" •"}
                    <QueueAddedBy userId={nowPlaying.currentTrack.creatorId} />
                  </>
                )}
              </>
            ) : (
              t("player.noneHelpText")
            )
          ) : (
            t("player.pausedHelpText")
          )}
        </div>
        <div
          role="link"
          className="text-inline-link font-bold text-lg leading-tight truncate max-w-full"
          onClick={() => track && openMenu()}
          tabIndex={0}
          onKeyDown={({ key }) => key === "Enter" && track && openMenu()}
        >
          {storyPlayingStarted
            ? track?.title ||
              (fetching ? (
                <div className="block-skeleton rounded mt-1 h-5 w-40" />
              ) : (
                t("player.noneText")
              ))
            : t("player.pausedText")}
        </div>
      </div>
      {track && (
        <TrackMenu id={track.id} active={activeMenu} close={closeMenu} />
      )}
    </>
  );
};

const StoryHeader: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const {
    state: { crossTracks, playingStoryId },
  } = usePlayer();

  const storyPlayingStarted = playingStoryId === story.id;

  const track = useMemo(
    () => (storyPlayingStarted ? crossTracks?.original : null),
    [crossTracks, storyPlayingStarted]
  );

  return (
    <div className="flex p-2">
      <div className="w-12 h-12 bg-background-secondary rounded overflow-hidden">
        {track && (
          <img
            className="w-full h-full object-cover"
            alt={`${t("nowPlaying.title")}: ${track.title}`}
            src={track.image}
          />
        )}
      </div>
      <div className="flex-1 w-0 px-2 flex flex-col justify-center relative">
        <NowPlayingMeta storyId={story.id} track={track} />
      </div>
      <StoryReaction story={story} />
    </div>
  );
};

export default StoryHeader;
