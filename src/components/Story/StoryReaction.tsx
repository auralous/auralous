import { SvgHeart } from "assets/svg";
import {
  NowPlayingReactionType,
  Story,
  useNowPlayingQuery,
  useNowPlayingReactionsQuery,
  useReactNowPlayingMutation,
} from "gql/gql.gen";
import { useBoop } from "hooks/animation";
import { useMe } from "hooks/user";
import React, { useCallback, useEffect, useMemo } from "react";
import { animated } from "react-spring";
import { toast } from "utils/toast";

const AnimatedSvgHeart = animated(SvgHeart);

const StoryReaction: React.FC<{ story: Story }> = ({ story }) => {
  // We are only using HEART reaction right now
  const me = useMe();

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
      !!me && !!nowPlayingReactions?.some((npr) => npr.userId === me.user.id),
    [me, nowPlayingReactions]
  );

  const react = useCallback(() => {
    if (reacted) return;
    if (me)
      reactNowPlaying({ id: story.id, reaction: NowPlayingReactionType.Heart });
    else toast.open({ type: "info", message: "Join to Add Your Reaction" });
  }, [story, reactNowPlaying, me, reacted]);

  return (
    <button
      className="btn flex-col flex-none btn-transparent p-2 flex flex-center rounded-full"
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

export default StoryReaction;
