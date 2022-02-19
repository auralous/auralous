import player from "@/player";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import type { YoutubeIframeRef } from "react-native-youtube-iframe";
import YoutubePlayer from "react-native-youtube-iframe";
import PlayerYoutubeContainer, {
  useYoutubeContainerSizes,
} from "./PlayerYoutubeContainer";

const YT_PLAYER_VARS = {
  controls: false,
  disablekb: true,
  fs: true,
};

const PlayerYoutube: FC = () => {
  const youtubeRef = useRef<YoutubeIframeRef>(null);
  const isPlayingRef = useRef<boolean>(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [volume, setVolume] = useState(100);

  const [isPlaying, setIsPlaying] = useState(false);

  const onChangeState = useCallback((event: string) => {
    // https://lonelycpp.github.io/react-native-youtube-iframe/component-props#onchangestate
    if (event === "paused") {
      isPlayingRef.current = false;
      player.emit("paused");
    } else if (event === "playing") {
      player.emit("playing");
      isPlayingRef.current = true;
    } else if (event === "ended") player.emit("ended");
  }, []);

  const [isReady, setIsReady] = useState(false);
  const onReady = useCallback(() => setIsReady(true), []);
  useEffect(() => {
    if (!videoId) setIsReady(false);
  }, [videoId]);

  useEffect(() => {
    if (Platform.OS === "android") {
      return AppState.addEventListener("change", (state) => {
        if (state !== "active") {
          setIsPlaying(false);
        } else {
          // @ts-ignore: using internals
          setIsPlaying(player.__wasPlaying);
        }
      }).remove;
    }
  }, []);

  useEffect(() => {
    player.registerPlayer({
      play: () => setIsPlaying(true),
      seek: (ms) => youtubeRef.current?.seekTo(ms / 1000, true),
      pause: () => setIsPlaying(false),
      playByExternalId: (externalId: string | null) => {
        setVideoId(externalId);
        setIsPlaying(true);
        player.emit("played_external", externalId);
      },
      setVolume: (p) => setVolume(p * 100),
      isPlaying: () => isPlayingRef.current,
    });

    return () => {
      player.unregisterPlayer();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    // getCurrentTime only work after player is ready
    // Retrieve current position every 1 sec
    const durationInterval = setInterval(async () => {
      player.emit(
        "time",
        ((await youtubeRef.current?.getCurrentTime()) || 0) * 1000
      );
    }, 1000);
    return () => {
      clearInterval(durationInterval);
    };
  }, [isReady]);

  const { height } = useYoutubeContainerSizes();

  if (!videoId) return null;

  return (
    <PlayerYoutubeContainer>
      {videoId && (
        <YoutubePlayer
          initialPlayerParams={YT_PLAYER_VARS}
          play={isPlaying}
          onChangeState={onChangeState}
          height={height}
          volume={volume}
          videoId={videoId}
          ref={youtubeRef}
          onReady={onReady}
          webViewProps={{
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
            mediaPlaybackRequiresUserAction: false,
          }}
        />
      )}
    </PlayerYoutubeContainer>
  );
};

export default PlayerYoutube;
