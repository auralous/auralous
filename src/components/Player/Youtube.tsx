import React, { useEffect, useState } from "react";
import usePlayer from "./usePlayer";
import { verifyScript } from "~/lib/script-utils";
import { SvgChevronDown, SvgChevronUp } from "~/assets/svg";
/// <reference path="youtube" />

const YT_PLAYER_VARS = {
  playsinline: 1,
  controls: 0,
  disablekb: 1,
  fs: 1,
  origin: process.env.APP_URI,
};

export default function YouTubePlayer() {
  const {
    state: { playerPlaying },
    player,
  } = usePlayer();

  useEffect(() => {
    let ytPlayer: YT.Player;
    let durationInterval: number; // setInterval

    function playById(externalId: string) {
      if (externalId === (ytPlayer as any).getVideoData()?.video_id) return;
      ytPlayer.loadVideoById(externalId);
    }

    async function init(hadLoaded: boolean) {
      if (!hadLoaded) {
        // wait for iframe api to load
        await new Promise((resolve) => {
          (window as any).onYouTubeIframeAPIReady = resolve;
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
                  // @ts-ignore
                  ytPlayer.getPlayerState() === window.YT.PlayerState.PLAYING,
              });
              durationInterval = window.setInterval(() => {
                player.emit("time", ytPlayer.getCurrentTime() * 1000);
              }, 1000);
              if (playerPlaying) playById(playerPlaying.externalId);
              ytPlayer.playVideo();
            },
            onStateChange(event: any) {
              // @ts-ignore
              event.data === window.YT.PlayerState.PAUSED
                ? player.emit("paused")
                : player.emit("playing");
              // ENDED
              // @ts-ignore
              if (event.data === window.YT.PlayerState.ENDED)
                player.emit("ended");
            },
          },
        });
      }
    }

    verifyScript("https://www.youtube.com/iframe_api").then(init);

    return function cleanup() {
      clearInterval(durationInterval);
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
    <>
      <div
        className={`absolute top-0 right-0 z-30 w-screen ${
          posIsTop ? "" : "md:bottom-0 md:top-auto"
        } md:w-72 h-48 overflow-hidden`}
      >
        <div
          className="absolute md:rounded-lg md:shadow-lg top-2 right-2 w-full h-full"
          id="ytPlayer"
        />
        <div className="absolute z-20 bottom-0 left-0 p-3 hidden md:block">
          <button
            className="button rounded-r-none p-1"
            onClick={() => setPosIsTop(true)}
            disabled={posIsTop}
            title="Move to top"
          >
            <SvgChevronUp width="14" height="14" />
          </button>
          <button
            className="button rounded-l-none p-1"
            onClick={() => setPosIsTop(false)}
            disabled={!posIsTop}
            title="Move to bottom"
          >
            <SvgChevronDown width="14" height="14" />
          </button>
        </div>
      </div>
    </>
  );
}
