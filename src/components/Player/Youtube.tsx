import React, { useEffect } from "react";
import usePlayer from "./usePlayer";
import { verifyScript } from "~/lib/script-utils";

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
    let ytPlayer: any;
    let durationInterval: number; // setInterval

    function playById(externalId: string) {
      if (externalId === ytPlayer.getVideoData()?.video_id) return;
      ytPlayer.loadVideoById(externalId);
    }

    async function init(hadLoaded: boolean) {
      if (!hadLoaded) {
        // wait for iframe api to load
        await new Promise((resolve) => {
          // @ts-ignore
          window.onYouTubeIframeAPIReady = resolve;
        });
      }

      // @ts-ignore
      if (!(ytPlayer instanceof window.YT.Player)) {
        // @ts-ignore
        ytPlayer = new window.YT.Player("ytPlayer", {
          playerVars: YT_PLAYER_VARS,
          events: {
            onReady() {
              player.registerPlayer({
                play: () => ytPlayer.playVideo(),
                seek: (ms) => {
                  ytPlayer.seekTo(ms / 1000);
                  player.emit("seeked");
                },
                pause: () => ytPlayer.pauseVideo(),
                loadById: playById,
                setVolume: (p) => ytPlayer.setVolume(p * 100),
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

  return (
    <>
      <div
        className={`absolute top-0 left-0 z-20 w-screen md:top-2 md:left-auto md:right-2 md:w-72 md:rounded-lg h-48 overflow-hidden shadow-lg`}
      >
        <div className="absolute inset-0 w-full h-full" id="ytPlayer" />
      </div>
    </>
  );
}
