/* eslint-disable jsx-a11y/no-distracting-elements */
import React from "react";
import Link from "next/link";
import { usePlayer } from "~/components/Player";
import { SvgMusic } from "~/assets/svg";

const NowPlayingPill: React.FC = () => {
  const {
    state: { playerControl, playerPlaying },
  } = usePlayer();
  if (!playerControl) return null;
  return (
    <Link href="/room/[roomId]" as={`/${playerControl.split(":").join("/")}`}>
      <button
        title="Back to Now Playing"
        className="button bg-pink mx-2 p-0 px-3 h-10"
      >
        <SvgMusic className="animate-pulse" width="20" height="20" />
        {/* LOL */}
        {/* @ts-ignore */}
        <marquee
          className="hidden sm:block w-16 md:w-24 ml-1 leading-none"
          scrolldelay={200}
        >
          {playerPlaying ? (
            <>
              <span className="text-xs">{playerPlaying.title}</span>{" "}
              <span className="text-foreground-secondary text-xs">
                - {playerPlaying.artists.map(({ name }) => name).join(", ")}
              </span>
            </>
          ) : (
            <p className="text-xs font-normal italic">
              Nothing is being played
            </p>
          )}

          {/* @ts-ignore */}
        </marquee>
      </button>
    </Link>
  );
};

export default NowPlayingPill;
