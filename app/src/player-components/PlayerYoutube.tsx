import player from "@/player";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { YoutubeIframeRef } from "react-native-youtube-iframe";
import YoutubePlayer from "react-native-youtube-iframe";

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    zIndex: 20,
  },
});

const widthToHeightRatio = 16 / 9;
const maxWidth = 356;

const PlayerYoutube: FC = () => {
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

  const safeAreaInsets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();

  const width = Math.min(maxWidth, (windowDimensions.width / 2) * 1.2);
  const height = width / widthToHeightRatio;

  const topMin = Size[2] + safeAreaInsets.top;
  const topMax = windowDimensions.height - height - Size[2];
  const rightMin = windowDimensions.width - width - Size[2];
  const rightMax = Size[2];

  const rightAnim = useSharedValue(rightMax);
  const topAnim = useSharedValue(topMin);

  const animStyles = useAnimatedStyle(
    () => ({
      top: topAnim.value,
      right: rightAnim.value,
    }),
    []
  );

  const panRef = useRef<PanGestureHandler>(null);
  const eventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      initialRight: number;
      initialTop: number;
    }
  >(
    {
      onStart: (event, context) => {
        context.initialTop = topAnim.value;
        context.initialRight = rightAnim.value;
      },
      onActive: (event, context) => {
        topAnim.value = context.initialTop + event.translationY;
        rightAnim.value = context.initialRight - event.translationX;
      },
      // BEGAN ------> ANY ------> FINISHED
      onFinish: (event, context) => {
        function clamp(num: number, min: number, max: number) {
          return Math.min(Math.max(num, min), max);
        }
        topAnim.value = withTiming(clamp(topAnim.value, topMin, topMax));
        if (event.translationX > windowDimensions.width / 4) {
          rightAnim.value = withTiming(rightMax);
        } else if (event.translationX < -windowDimensions.width / 4) {
          rightAnim.value = withTiming(rightMin);
        } else {
          rightAnim.value = withTiming(context.initialRight);
        }
      },
    },
    [topMin, topMax, rightMin, rightMax, windowDimensions]
  );

  if (!videoId) return null;

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={eventHandler}
      maxPointers={1}
      minDist={50}
    >
      <Animated.View style={[styles.root, animStyles, { width, height }]}>
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
    </PanGestureHandler>
  );
};

export default PlayerYoutube;
