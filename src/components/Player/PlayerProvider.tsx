import Portal from "@reach/portal";
import { useNowPlaying } from "components/NowPlaying/index";
import {
  PlatformName,
  Story,
  useMeQuery,
  usePingStoryMutation,
  useQueueQuery,
  useSkipNowPlayingMutation,
  useStoryQuery,
} from "gql/gql.gen";
import { useCrossTracks } from "hooks/track";
import { useMe } from "hooks/user";
import { t } from "i18n/index";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { PLATFORM_FULLNAMES } from "utils/constants";
import { toast } from "utils/toast";
import Player from "./Player";
import PlayerContext from "./PlayerContext";
import { IPlayerContext, PlayerPlaying } from "./types";

const YouTubePlayer = dynamic(() => import("./YouTubePlayer"), { ssr: false });
const SpotifyPlayer = dynamic(() => import("./SpotifyPlayer"), { ssr: false });

const player = new Player();

const usePlayFromNowPlaying = (story: Story | null) => {
  const [nowPlaying, { fetching }] = useNowPlaying(
    // Only fetch nowPlaying if station is still live
    story?.isLive ? story.id : ""
  );

  const me = useMe();

  const [
    { fetching: fetchingSkip },
    skipNowPlaying,
  ] = useSkipNowPlayingMutation();

  useEffect(() => {
    if (!nowPlaying) return undefined;

    let wasSeeked = false;

    const onPaused = () => (wasSeeked = false); // The player paused and should be seeked next time
    const onPlaying = async () => {
      if (!nowPlaying?.currentTrack) return;
      // When the player buffering due to seeking, this got triggered continously
      // We must treat buffering as "Playing"
      if (!wasSeeked) {
        // Resume to current live position
        // Delay a bit for player to load
        await new Promise((resolve) => {
          window.setTimeout(resolve, 1000);
        });
        player.seek(Date.now() - nowPlaying.currentTrack.playedAt.getTime());
        wasSeeked = true;
      }
    };
    player.on("playing", onPlaying);
    player.on("paused", onPaused);
    return () => {
      player.off("playing", onPlaying);
      player.off("paused", onPaused);
    };
  }, [nowPlaying]);

  const skipForward = useMemo(() => {
    // check if is skippable
    if (!story?.isLive) return;
    if (fetchingSkip || !nowPlaying?.currentTrack) return undefined;
    if (
      nowPlaying.currentTrack.creatorId !== me?.user.id &&
      story.creatorId !== me?.user.id
    )
      return undefined;
    // Is skippable, create skip fn
    return () => skipNowPlaying({ id: story.id });
  }, [story, nowPlaying, me, fetchingSkip, skipNowPlaying]);

  // This informs that the user is present in story
  const [, pingStory] = usePingStoryMutation();

  useEffect(() => {
    // story presence does not apply to unlive story
    if (!story?.isLive) return;
    if (me) {
      const pingInterval = window.setInterval(() => {
        pingStory({ id: story.id });
      }, 30 * 1000);
      return () => window.clearInterval(pingInterval);
    }
  }, [story, me, pingStory]);

  return [nowPlaying?.currentTrack, { fetching, skipForward }] as const;
};

const usePlayFromQueue = (story: Story | null) => {
  const [{ data: dataQueue, fetching }] = useQueueQuery({
    variables: { id: story?.id + ":played" },
    pause: story?.isLive !== false,
  });

  const queue =
    story?.isLive === false && dataQueue?.queue?.id === story?.id + ":played"
      ? dataQueue.queue
      : null;

  const [currQueueIndex, setCurrQueueIndex] = useState(0);
  useEffect(() => {
    // reset queue position on queue/story change
    setCurrQueueIndex(0);
  }, [story?.id]);

  const skipBackward = useMemo(() => {
    // check if is skippable
    if (!queue) return;
    if (currQueueIndex <= 0) return undefined;
    return () => setCurrQueueIndex(currQueueIndex - 1);
  }, [currQueueIndex, queue]);

  const skipForward = useMemo(() => {
    // check if is skippable
    if (!queue) return;
    if (currQueueIndex >= queue.items.length - 1) return undefined;
    return () => setCurrQueueIndex(currQueueIndex + 1);
  }, [currQueueIndex, queue]);

  const playQueueItem = useMemo(() => {
    if (!queue) return;
    return (queueItemId: string) => {
      setCurrQueueIndex(queue.items.findIndex((i) => i.id === queueItemId));
    };
  }, [queue]);

  useEffect(() => {
    if (!skipForward) return undefined;
    player.on("ended", skipForward);
    return () => {
      player.off("ended", skipForward);
    };
  }, [skipForward]);

  useEffect(() => {
    return;
  }, []);

  return [
    queue?.items[currQueueIndex],
    { fetching, skipBackward, skipForward, playQueueItem },
  ] as const;
};

const PlayerProvider: React.FC = ({ children }) => {
  /**
   * me
   * Platform and token
   */
  const [
    { data: { me } = { me: undefined }, fetching: fetchingMe },
    refetchMe,
  ] = useMeQuery({
    requestPolicy: "cache-and-network",
  });

  // We priodically get new tokens for services such as Spotify or Apple Music
  useEffect(() => {
    let t: number | undefined;
    if (me?.expiredAt) {
      const tm = me.expiredAt.getTime() - Date.now();
      // TODO: This indicates an error, report it
      if (tm < 0) return;
      t = window.setTimeout(refetchMe, tm);
    }
    return () => window.clearTimeout(t);
  }, [me, refetchMe]);

  // playingPlatform: Preferred platform to use by user
  // If the user is not sign in, defaulting to YouTube
  // However, we always wait for the result of mAuth
  // so that not to load unneccessary sdks
  const playingPlatform = useMemo<PlatformName | null>(() => {
    // if mAuth === undefined, it has not fetched
    if (me === undefined) return null;
    return me?.platform || PlatformName.Youtube;
  }, [me]);

  // Player Control: To play a story or a track
  const [playingStoryId, playStory] = useState<string>("");
  useEffect(() => {
    if (playingStoryId) player.wasPlaying = true;
  }, [playingStoryId]);

  const [{ data: dataStory }] = useStoryQuery({
    variables: { id: playingStoryId },
    pause: !playingStoryId,
  });

  const story = useMemo(
    () => (dataStory?.story?.id === playingStoryId ? dataStory.story : null),
    [dataStory, playingStoryId]
  );

  // For live story
  const [
    nowPlayingTrack,
    { fetching: fetchingNP, skipForward: skipForwardNP },
  ] = usePlayFromNowPlaying(story);

  // For nonlive story
  const [
    currQueueTrack,
    {
      fetching: fetchingQueue,
      skipBackward: skipBackwardQueue,
      skipForward: skipForwardQueue,
      playQueueItem,
    },
  ] = usePlayFromQueue(story);

  const playingQueueItemId = nowPlayingTrack?.id || currQueueTrack?.id;

  const skipBackward = skipBackwardQueue;
  const skipForward = skipForwardNP || skipForwardQueue;

  // Get track data
  const [crossTracks, { fetching: fetchingCrossTracks }] = useCrossTracks(
    currQueueTrack?.trackId || nowPlayingTrack?.trackId
  );

  // The track that is playing
  const playerPlaying = useMemo<PlayerPlaying>(() => {
    if (!playingPlatform) return null;
    if (!crossTracks) return (player.playerPlaying = null);
    return (player.playerPlaying = crossTracks[playingPlatform] || null);
  }, [crossTracks, playingPlatform]);

  // Show a message if track is not found
  useEffect(() => {
    if (!playingPlatform) return;
    if (crossTracks?.[playingPlatform] === null) {
      const tt = toast.error({
        message: t("player.noCrossTrack", {
          platformName: PLATFORM_FULLNAMES[playingPlatform],
        }),
        duration: 69420,
        type: "error",
      });
      return () => toast.dismiss(tt);
    }
  }, [crossTracks, playingPlatform]);

  // Player Component
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    // Avoid loading player lib before needed
    if (playingStoryId) setHasPlayed(true);
  }, [playingStoryId]);
  const DynamicPlayer = useMemo(() => {
    if (!playingPlatform || !hasPlayed) return null;
    if (playingPlatform === PlatformName.Youtube) return YouTubePlayer;
    return SpotifyPlayer;
  }, [playingPlatform, hasPlayed]);

  useEffect(() => {
    const handlePlayerChange = () =>
      player.playByExternalId(playerPlaying?.externalId || null);
    // If the user paused the track before playerPlaying change,
    // delay the switch until they press play again to avoid
    // unexpected play
    if (player.wasPlaying) {
      handlePlayerChange();
    } else {
      player.on("playing", handlePlayerChange);
      return () => player.off("playing", handlePlayerChange);
    }
  }, [playerPlaying?.externalId]);

  // Fetching status of everything
  // It is not reliable on changes of arg
  // (might show stale vdata)
  const fetching =
    fetchingMe || fetchingCrossTracks || fetchingNP || fetchingQueue;

  const playerContextValue = useMemo<IPlayerContext>(() => {
    return {
      state: {
        playerPlaying,
        playingStoryId,
        playingQueueItemId,
        crossTracks,
        fetching,
      },
      playStory,
      player,
      skipBackward,
      skipForward,
      playQueueItem,
    };
  }, [
    skipBackward,
    skipForward,
    fetching,
    playerPlaying,
    playingStoryId,
    crossTracks,
    playQueueItem,
    playingQueueItemId,
  ]);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <Portal>{DynamicPlayer && <DynamicPlayer />}</Portal>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
