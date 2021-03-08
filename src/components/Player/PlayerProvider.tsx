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
import { useMe, useMeLiveStory } from "hooks/user";
import { t } from "i18n/index";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PLATFORM_FULLNAMES } from "utils/constants";
import Player from "./Player";
import PlayerContext from "./PlayerContext";
import { PlayerPlaying } from "./types";

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
    let waitPlayTimeout: number;
    const onPlay = async () => {
      const currentTrack = nowPlaying.currentTrack;
      if (!currentTrack) return;
      // Resume to current live position
      // Delay a bit for player to load
      waitPlayTimeout = window.setTimeout(() => {
        player.seek(Date.now() - currentTrack.playedAt.getTime());
      }, 1000);
    };
    player.on("play", onPlay);
    return () => {
      window.clearTimeout(waitPlayTimeout);
      player.off("play", onPlay);
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

  const storyLive = useMeLiveStory();

  const router = useRouter();

  // if user has ongoing story, redirect them
  useEffect(() => {
    if (storyLive?.id) router.replace(`/story/${storyLive.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyLive?.id]);

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
      const tt = toast.error(
        t("player.noCrossTrack", {
          platformName: PLATFORM_FULLNAMES[playingPlatform],
        }),
        { duration: 69420 }
      );
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

  const playerStates = useMemo(
    () => ({
      player,
      playerPlaying,
      playingStoryId,
      playingQueueItemId,
      crossTracks,
      fetching,
    }),
    [playerPlaying, playingStoryId, playingQueueItemId, crossTracks, fetching]
  );

  const playerControls = useMemo(
    () => ({
      playStory,
      skipBackward,
      skipForward,
      playQueueItem,
    }),
    [playQueueItem, skipBackward, skipForward]
  );

  return (
    <PlayerContext.Provider value={[playerStates, playerControls]}>
      <Portal>{DynamicPlayer && <DynamicPlayer />}</Portal>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
