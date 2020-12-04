import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useI18n } from "~/i18n/index";
import { SvgX } from "~/assets/svg";

const noPlayerMinibarRoutes = ["/story/[storyId]"];

const PlayerMinibar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    state: { playingStoryId, playerPlaying },
    stopPlaying,
  } = usePlayer();
  const shouldHide = useMemo(
    () => !playingStoryId || noPlayerMinibarRoutes.includes(router.pathname),
    [router, playingStoryId]
  );

  return (
    <div
      className={`${
        shouldHide ? "hidden" : "flex"
      } fixed bordered-box items-center h-16 z-10 w-full sm:w-96 sm:rounded-lg sm:right-2 bottom-10 sm:bottom-2`}
    >
      <Link href={`/story/${playingStoryId}`}>
        <a className={`flex-1 w-0 flex items-center`}>
          <div className="w-16 h-16 p-2">
            {playerPlaying && (
              <img
                alt={t("nowPlaying.title")}
                src={playerPlaying.image}
                className="h-12 w-16 object-cover rounded-lg"
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
        onClick={stopPlaying}
        className="btn btn-transparent p-2"
        aria-label={t("player.stopPlaying")}
      >
        <SvgX />
      </button>
    </div>
  );
};

export default PlayerMinibar;
