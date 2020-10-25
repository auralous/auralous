import React, { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// @ts-ignore
import ColorThief from "colorthief";
import usePlayer from "./usePlayer";

const noPlayerMinibarRoutes = ["/room/[roomId]"];

const PlayerMinibar: React.FC = () => {
  const divRef = useRef<HTMLButtonElement>(null);
  const colorThief = useRef<ColorThief>();
  const router = useRouter();
  const {
    state: { playingRoomId, playerPlaying, playerContext },
  } = usePlayer();
  const shouldHide = useMemo(
    () => !playingRoomId || noPlayerMinibarRoutes.includes(router.pathname),
    [router, playingRoomId]
  );
  useEffect(() => {
    if (!divRef.current || !playerPlaying) return;
    try {
      colorThief.current = colorThief.current || new ColorThief();
      const img = new Image();
      img.addEventListener("load", async () => {
        divRef.current &&
          (divRef.current.style.backgroundColor = `rgb(${colorThief
            .current!.getColor(img)
            .join(", ")}`);
      });
      img.crossOrigin = "Anonymous";
      img.src = playerPlaying.image;
    } catch (e) {
      /* noop */
    }
  }, [playerPlaying]);

  return (
    <Link href="/room/[roomId]" as={`/room/${playingRoomId}`}>
      <button
        ref={divRef}
        className={`${
          shouldHide ? "hidden" : "flex"
        } items-center h-12 z-20 w-full rounded-t-lg overflow-hidden fixed bottom-0 left-0 transition-colors duration-300`}
      >
        <div
          className="opacity-50 absolute inset-0"
          style={{ zIndex: -1, backgroundColor: "#000814" }}
        />
        <img
          alt="Now Playing"
          src={playerPlaying?.image || playerContext.room?.image}
          className="h-10 w-10 mx-1 rounded-lg object-cover"
        />
        <div className="text-xs p-1 flex-1 w-0 text-left">
          <div className="font-bold leading-none truncate">
            {playerPlaying?.title || ""}
          </div>
          <div className="text-foreground-secondary truncate">
            {playerPlaying?.artists.map((artist) => artist.name).join(", ") ||
              ""}
          </div>
        </div>
      </button>
    </Link>
  );
};

export default PlayerMinibar;
