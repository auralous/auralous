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

// FIXME: Remove after these two:
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/49343
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/49344
enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: null | (() => void);
    YT: {
      PlayerState: PlayerState;
    };
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
        await new Promise((resolve) => {
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
    const bodyDom = document.querySelector("body");
    bodyDom?.classList.add("pt-youtube");
    return () => bodyDom?.classList.remove("pt-youtube");
  }, []);

  const [posIsTop, setPosIsTop] = useState(false);

  return (
    <div
      className={`absolute md:fixed top-0 right-0 z-20 w-screen ${
        posIsTop ? "" : "md:bottom-0 md:top-auto"
      } md:w-72 h-48`}
    >
      <div
        className="absolute bottom-0 right-0 md:bottom-2 md:right-2 w-full h-full md:rounded-lg md:shadow-xl overflow-hidden"
        id="ytPlayer"
      />
      <div className="absolute z-20 bottom-0 left-0 -ml-2 mb-2 p-2 hidden md:block">
        <button
          className="button button-light rounded-r-none p-1"
          onClick={() => setPosIsTop(true)}
          disabled={posIsTop}
          title={t("player.youtube.moveToTop")}
        >
          <SvgChevronUp width="14" height="14" />
        </button>
        <button
          className="button button-light rounded-l-none p-1"
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
