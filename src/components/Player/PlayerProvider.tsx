import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Portal from "@reach/portal";
import Player from "./Player";
import PlayerContext from "./PlayerContext";
import { useNowPlaying } from "~/components/NowPlaying/index";
import {
  PlatformName,
  Story,
  useQueueQuery,
  useStoryQuery,
  useSkipNowPlayingMutation,
} from "~/graphql/gql.gen";
import { useMAuth, useCurrentUser } from "~/hooks/user";
import { useCrossTracks } from "~/hooks/track";
import { IPlayerContext, PlayerPlaying } from "./types";
import { toast } from "~/lib/toast";
import { t } from "~/i18n/index";
import { PLATFORM_FULLNAMES } from "~/lib/constants";

const YouTubePlayer = dynamic(() => import("./YouTubePlayer"), { ssr: false });
const SpotifyPlayer = dynamic(() => import("./SpotifyPlayer"), { ssr: false });

const player = new Player();

const usePlayFromNowPlaying = (story: Story | null) => {
  const [nowPlaying, { fetching }] = useNowPlaying(
    // Only fetch nowPlaying if station is still live
    story?.isLive ? story.id : ""
  );

  const user = useCurrentUser();

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
      nowPlaying.currentTrack.creatorId !== user?.id &&
      story.creatorId !== user?.id
    )
      return undefined;
    // Is skippable, create skip fn
    return () => skipNowPlaying({ id: story.id });
  }, [story, nowPlaying, user, fetchingSkip, skipNowPlaying]);

  return [
    nowPlaying?.currentTrack?.trackId,
    { fetching, skipForward },
  ] as const;
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
    queue?.items[currQueueIndex]?.trackId,
    { fetching, skipBackward, skipForward, playQueueItem },
  ] as const;
};

const PlayerProvider: React.FC = ({ children }) => {
  /**
   * mAuth
   * Platform and token
   */
  const {
    data: mAuth,
    isFetching: fetchingMAuth,
    refetch: mAuthRefetch,
  } = useMAuth();

  // We priodically get new tokens for services such as Spotify or Apple Music
  useEffect(() => {
    let t: number | undefined;
    if (mAuth?.expiredAt) {
      const tm = mAuth.expiredAt.getTime() - Date.now();
      // TODO: This indicates an error, report it
      if (tm < 0) return;
      t = window.setTimeout(mAuthRefetch, tm);
    }
    return () => window.clearTimeout(t);
  }, [mAuth, mAuthRefetch]);

  // playingPlatform: Preferred platform to use by user
  // If the user is not sign in, defaulting to YouTube
  // However, we always wait for the result of mAuth
  // so that not to load unneccessary sdks
  const playingPlatform = useMemo<PlatformName | null>(() => {
    // if mAuth === undefined, it has not fetched
    if (mAuth === undefined) return null;
    return mAuth?.platform || PlatformName.Youtube;
  }, [mAuth]);

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
    nowPlayingTrackId,
    { fetching: fetchingNP, skipForward: skipForwardNP },
  ] = usePlayFromNowPlaying(story);

  // For nonlive story
  const [
    currQueueTrackId,
    {
      fetching: fetchingQueue,
      skipBackward: skipBackwardQueue,
      skipForward: skipForwardQueue,
      playQueueItem,
    },
  ] = usePlayFromQueue(story);

  const currTrackId = currQueueTrackId || nowPlayingTrackId;

  // Get track data
  const [crossTracks, { fetching: fetchingCrossTracks }] = useCrossTracks(
    currTrackId
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
  const DynamicPlayer = useMemo(() => {
    if (!playingPlatform) return null;
    if (playingPlatform === PlatformName.Youtube) return YouTubePlayer;
    return SpotifyPlayer;
  }, [playingPlatform]);

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
    fetchingMAuth || fetchingCrossTracks || fetchingNP || fetchingQueue;

  const playerContextValue = useMemo<IPlayerContext>(() => {
    return {
      state: {
        playerPlaying,
        playingStoryId,
        crossTracks,
        fetching,
      },
      playStory,
      player,
      skipBackward: skipBackwardQueue,
      skipForward: skipForwardNP || skipForwardQueue,
      playQueueItem,
    };
  }, [
    skipBackwardQueue,
    skipForwardQueue,
    fetching,
    playerPlaying,
    skipForwardNP,
    playingStoryId,
    crossTracks,
    playQueueItem,
  ]);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <Portal>{DynamicPlayer && <DynamicPlayer />}</Portal>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
