import player from "@/player";
import { injectScript } from "@/utils/scripts";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import PlayerYoutubeContainer from "./PlayerYoutubeContainer";

/// <reference path="youtube" />
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: null | (() => void);
  }
}

const styles = StyleSheet.create({
  innerPlayer: {
    height: "100%",
    width: "100%",
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
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    let durationInterval: number; // setInterval
    const ytPlayerDom = document.querySelector("#ytPlayer") as HTMLElement;
    const ytPlayer = new window.YT.Player(ytPlayerDom, {
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
                setHasVideo(false);
                return;
              }
              setHasVideo(true);
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
    // eslint-disable-next-line react-native/no-inline-styles
    <PlayerYoutubeContainer style={!hasVideo ? { display: "none" } : undefined}>
      <View
        pointerEvents="none"
        nativeID="ytPlayer"
        style={styles.innerPlayer}
      />
    </PlayerYoutubeContainer>
  );
};

export default PlayerYoutube;
