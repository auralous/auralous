import React, { useEffect, useState } from "react";
import usePlayer from "./usePlayer";
import { verifyScript } from "~/lib/script-utils";
import { useI18n } from "~/i18n/index";
import { SvgChevronDown, SvgChevronUp } from "~/assets/svg";
/// <reference path="youtube" />

const YT_PLAYER_VARS = {
  playsinline: 1,
  controls: 0,
  disablekb: 1,
  fs: 1,
  origin: process.env.APP_URI,
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: null | (() => void);
  }
}

export default function YouTubePlayer() {
  const { t } = useI18n();
  const { player } = usePlayer();

  useEffect(() => {
    let ytPlayer: YT.Player;
    let durationInterval: number; // setInterval

    function playById(externalId: string) {
      ytPlayer.loadVideoById(externalId);
      ytPlayer.playVideo();
    }

    async function init(hadLoaded: boolean) {
      if (!hadLoaded) {
        // wait for iframe api to load
        await new Promise<void>((resolve) => {
          window.onYouTubeIframeAPIReady = resolve;
        });
      }
      if (!(ytPlayer instanceof window.YT.Player)) {
        ytPlayer = new window.YT.Player("ytPlayer", {
          playerVars: YT_PLAYER_VARS,
          events: {
            onReady() {
              player.registerPlayer({
                play: () => ytPlayer.playVideo(),
                seek: (ms) => {
                  ytPlayer.seekTo(ms / 1000, true);
                  player.emit("seeked");
                },
                pause: () => ytPlayer.pauseVideo(),
                loadById: playById,
                setVolume: (p) => ytPlayer.setVolume(p * 100),
                isPlaying: () =>
                  ytPlayer.getPlayerState() === window.YT.PlayerState.PLAYING,
              });
              // durationInterval = window.setInterval(() => {
              //   player.emit("time", ytPlayer.getCurrentTime() * 1000);
              // }, 1000);
            },
            onStateChange(event) {
              event.data === window.YT.PlayerState.PAUSED
                ? player.emit("paused")
                : player.emit("playing");
              // ENDED
              if (event.data === window.YT.PlayerState.ENDED)
                player.emit("ended");
            },
          },
        });
      }
    }

    verifyScript("https://www.youtube.com/iframe_api").then(init);

    return function cleanup() {
      window.clearInterval(durationInterval);
      window.onYouTubeIframeAPIReady = null;
      player.unregisterPlayer();
      ytPlayer?.destroy();
    };
  }, [player]);

  useEffect(() => {
    // Add a padding to body to add the youtube video
    const mainDom = document.querySelector("main");
    mainDom?.classList.add("pt-youtube");
    return () => mainDom?.classList.remove("pt-youtube");
  }, []);

  const [posIsTop, setPosIsTop] = useState(false);

  return (
    <div
      className={`absolute sm:fixed top-0 right-0 z-20 sm:z-30 w-screen ${
        posIsTop ? "" : "sm:bottom-0 sm:top-auto"
      } sm:w-72 h-48`}
    >
      <div
        className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 w-full h-full sm:rounded-lg sm:shadow-xl overflow-hidden"
        id="ytPlayer"
      />
      <div className="absolute bottom-0 left-0 -ml-2 mb-2 p-2 hidden sm:block">
        <button
          className="btn btn-success rounded-r-none p-1"
          onClick={() => setPosIsTop(true)}
          disabled={posIsTop}
          title={t("player.youtube.moveToTop")}
        >
          <SvgChevronUp width="14" height="14" />
        </button>
        <button
          className="btn btn-success rounded-l-none p-1"
          onClick={() => setPosIsTop(false)}
          disabled={!posIsTop}
          title={t("player.youtube.moveToBottom")}
        >
          <SvgChevronDown width="14" height="14" />
        </button>
      </div>
    </div>
  );
}
