import player from "@auralous/player";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";

const styles = StyleSheet.create({ root: {} });

const height = 212;

const PlayerYoutube: FC = () => {
  const heightValue = useSharedValue(0);

  const youtubeRef = useRef<YoutubeIframeRef>(null);
  const isPlayingRef = useRef<boolean>(false);
  const [videoId, setVideoId] = useState<string | null>(
    player.playingExternalId
  );
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
    player.registerPlayer({
      play: () => setIsPlaying(true),
      seek: (ms) => youtubeRef.current?.seekTo(ms / 1000, true),
      pause: () => setIsPlaying(false),
      playByExternalId: (externalId: string | null) => {
        setVideoId(externalId);
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

  useEffect(() => {
    if (videoId) heightValue.value = withTiming(height);
    else heightValue.value = withTiming(0);
  });

  const style = useAnimatedStyle(() => ({ height: heightValue.value }), []);

  return (
    <Animated.View style={[styles.root, style]}>
      {videoId && (
        <YoutubePlayer
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
    </Animated.View>
  );
};

export default PlayerYoutube;
