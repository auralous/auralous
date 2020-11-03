import React, { useState, useEffect, useMemo } from "react";
import usePlayer from "./usePlayer";
import { useModal } from "~/components/Modal";
import { SvgPlay, SvgPause, SvgAlertCircle } from "~/assets/svg";
import { TrackMenu } from "~/components/Track/index";
import { NowPlayingReaction } from "~/components/NowPlaying/index";
import { PlayerError } from "./types";
import { PLATFORM_FULLNAMES } from "~/lib/constants";

const PlayerEmbeddedControl: React.FC<{ roomId: string }> = ({ roomId }) => {
  const {
    player,
    state: {
      playingRoomId,
      playingPlatform,
      playerPlaying,
      originalTrack,
      fetching,
      error,
    },
    playRoom,
  } = usePlayer();

  const [isPlaying, setIsPlaying] = useState(() => player.isPlaying);

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

  const roomPlayingStarted = playingRoomId === roomId;

  const track = useMemo(
    () => (roomPlayingStarted ? playerPlaying || originalTrack : null),
    [playerPlaying, originalTrack, roomPlayingStarted]
  );

  return (
    <>
      <div>
        <div className="w-3/5 mx-auto max-w-64">
          <div className="pb-full h-0 relative mx-auto bg-background-secondary rounded overflow-hidden flex flex-center shadow-2xl">
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
            className="max-w-full h-12 mb-2"
          >
            <div
              onClick={() => playerPlaying && openMenu()}
              role="button"
              onKeyDown={({ key }) =>
                key === "Enter" && playerPlaying && openMenu()
              }
              tabIndex={0}
              className={`${
                playerPlaying
                  ? "cursor-pointer hover:bg-background-secondary"
                  : ""
              } rounded overflow-hidden`}
            >
              <h2 className="font-bold text-lg leading-tight truncate">
                {roomPlayingStarted
                  ? track?.title ||
                    (fetching ? (
                      <span className="block mb-1 h-5 w-40 bg-foreground-tertiary rounded-full animate-pulse" />
                    ) : (
                      "Nothing is playing"
                    ))
                  : "Room has been paused"}
              </h2>
            </div>
            <div className="truncate text-foreground-secondary text-sm">
              {roomPlayingStarted
                ? track?.artists.map(({ name }) => name).join(", ") ||
                  (fetching ? (
                    <span className="block h-4 w-32 mx-auto bg-foreground-tertiary rounded-full animate-pulse" />
                  ) : (
                    "Add a song to listen together"
                  ))
                : "Use the button below to unpause"}
            </div>
          </div>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            className="button bg-transparent hover:bg-white hover:bg-opacity-10 w-16 h-16 rounded-full"
            onClick={() => {
              if (!roomPlayingStarted) return playRoom(roomId);
              isPlaying ? player.pause() : player.play();
            }}
            disabled={!playerPlaying && roomPlayingStarted}
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
      {track && (
        <TrackMenu id={track.id} active={activeMenu} close={closeMenu} />
      )}
      <div className="w-full">
        <NowPlayingReaction id={roomId} />
      </div>
    </>
  );
};

export default PlayerEmbeddedControl;
