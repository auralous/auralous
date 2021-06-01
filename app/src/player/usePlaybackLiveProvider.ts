import {
  useNowPlayingQuery,
  useNowPlayingSkipMutation,
  useOnNowPlayingUpdatedSubscription,
} from "@/gql/gql.gen";
import { useMe } from "@/gql/hooks";
import { useEffect } from "react";
import { PlaybackContextType } from "./Context";
import Player from "./Player";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackLiveProvider = (
  player: Player,
  contextType: PlaybackContextType | null,
  contextId: string | null
) => {
  const me = useMe();

  const contextData = usePlaybackContextData(contextType, contextId);

  const active = Boolean(contextData.story?.isLive);

  const [
    { data: { nowPlaying } = { nowPlaying: undefined }, fetching: fetchingNP },
  ] = useNowPlayingQuery({
    variables: { id: contextData.story?.id || "" },
    pause: !active,
    requestPolicy: "cache-and-network",
  });
  useOnNowPlayingUpdatedSubscription({
    variables: { id: contextData.story?.id || "" },
    pause: !active,
  });

  useEffect(() => {
    // We hook into `play` event to trigger
    // seeking to live position on resume
    if (!nowPlaying) return undefined;
    let waitPlayTimeout: ReturnType<typeof setTimeout>;
    const onPlay = () => {
      const currentTrack = nowPlaying.currentTrack;
      if (!currentTrack) return;
      // Resume to current live position
      // Delay a bit for player to load
      waitPlayTimeout = setTimeout(() => {
        player.seek(Date.now() - currentTrack.playedAt.getTime());
      }, 1000);
    };

    player.on("play", onPlay);
    return () => {
      clearTimeout(waitPlayTimeout);
      player.off("play", onPlay);
    };
  }, [player, nowPlaying]);

  const [{ fetching: fetchingSkip }, skipNowPlaying] =
    useNowPlayingSkipMutation();

  const canSkipForward = Boolean(
    active &&
      !fetchingSkip &&
      nowPlaying?.currentTrack &&
      me &&
      (contextData.story?.queueable.includes(me.user.id) ||
        contextData.story?.creatorId === me?.user.id)
  );

  useEffect(() => {
    if (!canSkipForward) return;
    const skipFn = () => skipNowPlaying({ id: contextData.story?.id || "" });
    player.on("skip-forward", skipFn);
    return () => player.off("skip-forward", skipFn);
  }, [player, canSkipForward, contextData, skipNowPlaying]);

  return {
    queueIndex: 0,
    trackId: nowPlaying?.currentTrack?.trackId || null,
    canSkipForward,
    canSkipBackward: false,
    fetching: fetchingNP,
  };
};

export default usePlaybackLiveProvider;
