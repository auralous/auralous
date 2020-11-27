import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useI18n } from "~/i18n/index";
import { SvgX } from "~/assets/svg";

const noPlayerMinibarRoutes = ["/room/[roomId]"];

const PlayerMinibar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    state: { playingRoomId, playerPlaying },
    stopPlaying,
  } = usePlayer();
  const shouldHide = useMemo(
    () => !playingRoomId || noPlayerMinibarRoutes.includes(router.pathname),
    [router, playingRoomId]
  );

  return (
    <div
      className={`${
        shouldHide ? "hidden" : "flex"
      } items-center h-16 z-10 w-96 max-w-full bordered-box rounded-lg fixed bottom-0 sm:bottom-2 transform left-1/2 -translate-x-1/2`}
    >
      <Link href="/room/[roomId]" as={`/room/${playingRoomId}`}>
        <a className={`flex-1 w-0 flex shadow-lg items-center`}>
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
        className="button button-transparent p-2"
        aria-label={t("player.stopPlaying")}
      >
        <SvgX />
      </button>
    </div>
  );
};

export default PlayerMinibar;
