import { SvgPause, SvgPlay, SvgX } from "assets/svg";
import { Button } from "components/Pressable";
import { useI18n } from "i18n/index";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

const PlayerMinibar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
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

  if (!playingStoryId || router.pathname === "/story/[storyId]") return null;

  return (
    <div
      className={`flex fixed z-10 w-full bottom-10 md:bottom-0 border-t-4 border-primary items-center box-content space-x-1`}
      style={{
        background: "linear-gradient(180deg, hsl(232,12%,13%), rgb(18 18 24))",
      }}
    >
      <Link href={`/story/${playingStoryId}`}>
        <a className="flex-1 w-0 flex items-center">
          <div className="w-14 h-14 box-border p-1">
            {playerPlaying && (
              <img
                alt={t("nowPlaying.title")}
                src={playerPlaying.image}
                className="h-full w-full object-cover rounded shadow-lg"
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
      <Button
        accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
        onPress={() => (isPlaying ? player.pause() : player.play())}
        icon={
          isPlaying ? (
            <SvgPause className="fill-current" />
          ) : (
            <SvgPlay className="fill-current" />
          )
        }
        styling="link"
      />
      <Button
        accessibilityLabel={t("player.stopPlaying")}
        onPress={() => playStory("")}
        icon={<SvgX />}
        styling="link"
      />
    </div>
  );
};

export default PlayerMinibar;
