import React, { useState, useEffect, useMemo } from "react";
import usePlayer from "./usePlayer";
import { useModal } from "~/components/Modal";
import { SvgPlay, SvgPause, SvgAlertCircle } from "~/assets/svg";
import TrackMenu from "~/components/Track/TrackMenu";
import { NowPlayingReaction } from "~/components/NowPlaying/index";
import { PlayerError } from "./types";
import { PLATFORM_FULLNAMES } from "~/lib/constants";

const PlayerEmbeddedControl: React.FC<{ nowPlayingReactionId?: string }> = ({
  nowPlayingReactionId,
}) => {
  const {
    player,
    state: { playingPlatform, playerPlaying, originalTrack, error },
  } = usePlayer();

  const [isPlaying, setIsPlaying] = useState(player.isPlaying);

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

  const [activeMenu, openMenu, closeMenu] = useModal();

  const track = useMemo(() => playerPlaying || originalTrack, [
    playerPlaying,
    originalTrack,
  ]);

  return (
    <>
      <div>
        <div className="w-3/5 mx-auto max-w-64">
          <div className="pb-full h-0 relative mx-auto bg-background-secondary rounded overflow-hidden flex place-center">
            {track && (
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Now Playing"
                src={track.image}
              />
            )}
          </div>
        </div>
        <div className="mt-2 mb-4 max-w-lg px-2 mx-auto text-center flex flex-col items-center justify-start">
          <div
            aria-label="Track name and artists"
            onClick={openMenu}
            role="button"
            tabIndex={0}
            className="max-w-full"
            onKeyDown={({ key }) => key === "Enter" && openMenu()}
          >
            <h2 className="font-bold text-lg leading-tight truncate">
              {track?.title}
            </h2>
            <div className="truncate text-foreground-secondary text-sm">
              {track?.artists.map(({ name }) => name).join(", ")}
            </div>
          </div>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            className="button bg-transparent hover:bg-white hover:bg-opacity-10 mt-2 w-16 h-16 rounded-full"
            onClick={() => (isPlaying ? player.pause() : player.play())}
            disabled={!playerPlaying}
          >
            {isPlaying ? (
              <SvgPause fill="white" stroke="white" />
            ) : (
              <SvgPlay fill="white" stroke="white" />
            )}
          </button>
          {error !== undefined && (
            <p className="text-xs">
              <SvgAlertCircle width="12" className="inline text-danger-light" />{" "}
              {error === PlayerError.NOT_AVAILABLE_ON_PLATFORM && (
                <span className="align-middle">
                  <i>
                    <b>{originalTrack?.title} </b>-{" "}
                    <span>
                      {originalTrack?.artists
                        .map(({ name }) => name)
                        .join(", ")}
                    </span>
                  </i>{" "}
                  is not available on{" "}
                  {playingPlatform && (
                    <b>{PLATFORM_FULLNAMES[playingPlatform]}</b>
                  )}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {playerPlaying && (
        <TrackMenu
          track={playerPlaying}
          active={activeMenu}
          close={closeMenu}
        />
      )}
      {nowPlayingReactionId && (
        <div className="w-full">
          <NowPlayingReaction id={nowPlayingReactionId} />
        </div>
      )}
    </>
  );
};

export default PlayerEmbeddedControl;
