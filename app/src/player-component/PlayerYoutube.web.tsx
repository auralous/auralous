import player from "@/player";
import { LayoutSize, Size } from "@/styles/spacing";
import { injectScript } from "@/utils/scripts";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

/// <reference path="youtube" />
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: null | (() => void);
  }
}

const height = 200;
const width = 355;

const styles = StyleSheet.create({
  innerPlayer: {
    height: "100%",
    width: "100%",
  },
  root: {
    height,
  },
  rootLand: {
    height,
    position: "absolute",
    right: Size[2],
    top: Size[2],
    width,
    zIndex: 20,
  },
});

const YT_PLAYER_VARS = {
  playsinline: 1,
  controls: 0,
  disablekb: 1,
  fs: 1,
  origin: process.env.APP_URI,
};

const PlayerYoutube: FC = () => {
  const [loaded, setLoaded] = useState(false);

  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    if (!loaded) return;
    let durationInterval: number; // setInterval

    const ytPlayer = new window.YT.Player("ytPlayer", {
      playerVars: YT_PLAYER_VARS,
      events: {
        onReady(event) {
          player.registerPlayer({
            play: () => event.target.playVideo(),
            seek: (ms) => {
              event.target.seekTo(ms / 1000, true);
              player.emit("seeked");
            },
            pause: () => event.target.pauseVideo(),
            playByExternalId: async (externalId) => {
              if (!externalId) {
                event.target.pauseVideo();
                player.emit("played_external", null);
                return;
              }
              event.target.loadVideoById(externalId);
              player.emit("played_external", externalId);
              player.play();
            },
            setVolume: (p) => event.target.setVolume(p * 100),
            isPlaying: () =>
              event.target.getPlayerState() === window.YT.PlayerState.PLAYING,
          });
          durationInterval = window.setInterval(() => {
            player.emit("time", event.target.getCurrentTime() * 1000);
          }, 1000);
        },
        onStateChange(event) {
          player.emit("time", event.target.getCurrentTime() * 1000);
          event.data === window.YT.PlayerState.PAUSED
            ? player.emit("paused")
            : player.emit("playing");
          // ENDED
          if (event.data === window.YT.PlayerState.ENDED) player.emit("ended");
        },
      },
    });

    return () => {
      player.unregisterPlayer();
      window.clearInterval(durationInterval);
      ytPlayer.destroy();
    };
  }, [loaded]);

  useEffect(() => {
    if (loaded) return;
    if (window.YT) {
      setLoaded(true);
    }
    window.onYouTubeIframeAPIReady = () => setLoaded(true);
    injectScript("https://www.youtube.com/iframe_api");
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, [loaded]);

  return (
    <View style={windowWidth >= LayoutSize.md ? styles.rootLand : styles.root}>
      <View nativeID="ytPlayer" style={styles.innerPlayer} />
    </View>
  );
};

export default PlayerYoutube;
