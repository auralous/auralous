import { SvgHeart } from "assets/svg";
import clsx from "clsx";
import { Button } from "components/Pressable";
import {
  NowPlayingReactionType,
  Story,
  useNowPlayingQuery,
  useNowPlayingReactionsQuery,
  useReactNowPlayingMutation,
} from "gql/gql.gen";
import { useBoop } from "hooks/animation";
import { useMe } from "hooks/user";
import { useI18n } from "i18n";
import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { animated } from "react-spring";

const AnimatedSvgHeart = animated(SvgHeart);

const StoryReaction: React.FC<{ story: Story }> = ({ story }) => {
  // We are only using HEART reaction right now
  const { t } = useI18n();
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
    if (me)
      reactNowPlaying({ id: story.id, reaction: NowPlayingReactionType.Heart });
    else toast(t("story.reaction.authPrompt"));
  }, [story, reactNowPlaying, me, t]);

  return (
    <Button
      icon={
        <AnimatedSvgHeart
          className={clsx("w-6 h-6", reacted && "text-primary fill-current")}
          style={animatedStyles}
        />
      }
      title={`` + (nowPlayingReactions?.length || 0)}
      size="sm"
      accessibilityLabel={t("story.reaction.love")}
      onClick={react}
      disabled={!nowPlaying?.currentTrack || reacted}
    />
  );
};

export default StoryReaction;
