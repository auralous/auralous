import React, { useEffect, useState } from "react";
import usePlayer from "./usePlayer";
import { verifyScript } from "~/lib/script-utils";
import { useI18n } from "~/i18n/index";
import { SvgMove } from "~/assets/svg";
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
  const {
    player,
    state: { playerPlaying },
  } = usePlayer();

  useEffect(() => {
    let ytPlayer: YT.Player;
    let durationInterval: number; // setInterval

    function playByExternalId(externalId: string | null) {
      if (!externalId) return ytPlayer.pauseVideo();
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
                playByExternalId,
                setVolume: (p) => ytPlayer.setVolume(p * 100),
                isPlaying: () =>
                  ytPlayer.getPlayerState() === window.YT.PlayerState.PLAYING,
              });
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

  const [posIsTop, setPosIsTop] = useState(true);

  return (
    <div
      className={`${playerPlaying ? "" : "hidden"} fixed z-20 ${
        posIsTop ? "top-2 right-2" : "bottom-2 right-2"
      } w-56 h-36 rounded-lg shadow-xl overflow-hidden transition-transform`}
    >
      <button
        className="btn absolute z-30 bottom-2 left-2 opacity-50 hover:opacity-75 focus:opacity-70 p-2"
        onClick={() => setPosIsTop(!posIsTop)}
        title={`${t("player.youtube.moveTo.title")} ${
          posIsTop
            ? t("player.youtube.moveTo.bottomRight")
            : t("player.youtube.moveTo.topRight")
        }`}
      >
        <SvgMove className="w-6 h-6" />
      </button>
      <div
        className="bottom-0 left-0 absolute w-full h-full overflow-hidden"
        id="ytPlayer"
      />
    </div>
  );
}
