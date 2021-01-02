import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useI18n } from "~/i18n/index";
import { SvgX, SvgPause, SvgPlay } from "~/assets/svg";

const PlayerMinibarBar: React.FC = () => {
  const { t } = useI18n();
  const {
    state: { playingStoryId, playerPlaying },
    playStory,
    player,
  } = usePlayer();

  useEffect(() => {
    const onPlaying = () => setIsPlaying(true);
    const onPaused = () => setIsPlaying(false);
    player.on("playing", onPlaying);
    player.on("paused", onPaused);
    return () => {
      player.off("playing", onPlaying);
      player.off("paused", onPaused);
    };
  }, [player]);

  const [isPlaying, setIsPlaying] = useState(() => player.isPlaying);

  return (
    <div className="w-full h-full inset-0 flex items-center">
      <Link href={`/story/${playingStoryId}`}>
        <a className="flex-1 w-0 flex items-center">
          <div className="w-14 h-14 p-2">
            {playerPlaying && (
              <img
                alt={t("nowPlaying.title")}
                src={playerPlaying.image}
                className="h-full w-full object-cover rounded"
              />
            )}
          </div>
          <div className="text-xs p-2 flex-1 w-0 text-left">
            <div className="font-bold leading-none truncate">
              {playerPlaying?.title || t("player.noneText")}
            </div>
            <div className="text-foreground-secondary truncate">
              {playerPlaying?.artists.map((artist) => artist.name).join(", ") ||
                t("player.noneHelpText")}
            </div>
          </div>
        </a>
      </Link>
      <button
        title={isPlaying ? t("player.pause") : t("player.play")}
        className="btn btn-transparent p-2"
        onClick={() => (isPlaying ? player.pause() : player.play())}
      >
        {isPlaying ? (
          <SvgPause className="fill-current" />
        ) : (
          <SvgPlay className="fill-current" />
        )}
      </button>
      <button
        title={t("player.stopPlaying")}
        className="btn btn-transparent p-2"
        onClick={() => playStory("")}
      >
        <SvgX />
      </button>
    </div>
  );
};

const PlayerMinibar: React.FC = () => {
  const router = useRouter();
  const {
    state: { playingStoryId },
  } = usePlayer();

  return (
    <div
      hidden={!playingStoryId || router.pathname === "/story/[storyId]"}
      className="fixed h-14 z-10 w-full bottom-10 md:bottom-0 border-t-4 border-primary"
      style={{
        background: "linear-gradient(180deg, hsl(232,12%,13%), rgb(18 18 24))",
      }}
    >
      <PlayerMinibarBar />
    </div>
  );
};

export default PlayerMinibar;
