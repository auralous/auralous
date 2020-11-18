import React, { useState, useEffect, useMemo } from "react";
import usePlayer from "./usePlayer";
import { useModal } from "~/components/Modal";
import { SvgPlay, SvgPause, SvgAlertCircle } from "~/assets/svg";
import { TrackMenu } from "~/components/Track/index";
import {
  NowPlayingReaction,
  useNowPlaying,
} from "~/components/NowPlaying/index";
import { PLATFORM_FULLNAMES } from "~/lib/constants";
import { useI18n } from "~/i18n/index";
import { PlayerError } from "./types";
import { useCurrentUser } from "~/hooks/user";
import {
  Track,
  useRoomQuery,
  useSkipNowPlayingMutation,
} from "~/graphql/gql.gen";

const ErrorOverlay: React.FC = () => {
  const { t } = useI18n();

  const {
    state: { error, originalTrack, playingPlatform },
  } = usePlayer();

  if (!error) return null;
  return (
    <p className="text-xs">
      <SvgAlertCircle width="12" className="inline text-danger-light" />{" "}
      {error === PlayerError.NOT_AVAILABLE_ON_PLATFORM && (
        <span className="align-middle">
          <i>
            <b>{originalTrack?.title} </b>-{" "}
            <span>
              {originalTrack?.artists.map(({ name }) => name).join(", ")}
            </span>
          </i>{" "}
          {t("player.noCrossTrackText")}{" "}
          {playingPlatform && <b>{PLATFORM_FULLNAMES[playingPlatform]}</b>}
        </span>
      )}
    </p>
  );
};

const SkipNowPlaying: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { t } = useI18n();

  const [{ data: { room } = { room: undefined } }] = useRoomQuery({
    variables: { id: roomId },
  });

  const user = useCurrentUser();
  const [nowPlaying] = useNowPlaying(roomId);
  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();
  if (!room || !user || !nowPlaying?.currentTrack) return null;
  if (
    user.id !== room.creatorId &&
    nowPlaying?.currentTrack?.creatorId !== user.id
  )
    return null;
  return (
    <button
      className="button text-xs py-1 px-2 leading-none"
      onClick={() => skipNowPlaying({ id: room.id })}
      disabled={fetching}
    >
      {t("nowPlaying.skipSong")}
    </button>
  );
};

const PlayerMenu: React.FC<{ roomId: string }> = ({ roomId }) => {
  return (
    <div className="absolute top-0 right-0 p-1">
      <SkipNowPlaying roomId={roomId} />
    </div>
  );
};

const NowPlayingMeta: React.FC<{
  roomId: string;
  track: Track | null | undefined;
}> = ({ roomId, track }) => {
  const { t } = useI18n();
  const {
    state: { playerPlaying, fetching, playingRoomId },
  } = usePlayer();

  const roomPlayingStarted = playingRoomId === roomId;

  const [activeMenu, openMenu, closeMenu] = useModal();

  return (
    <div className="mb-1">
      <div
        onClick={() => playerPlaying && openMenu()}
        role="button"
        onKeyDown={({ key }) => key === "Enter" && playerPlaying && openMenu()}
        tabIndex={0}
        className={`${
          playerPlaying ? "cursor-pointer hover:bg-background-secondary" : ""
        } rounded overflow-hidden`}
      >
        <h2 className="font-bold text-lg leading-tight truncate">
          {roomPlayingStarted
            ? track?.title ||
              (fetching ? (
                <span className="block mb-1 h-5 w-40 bg-foreground-tertiary rounded-full animate-pulse" />
              ) : (
                t("player.noneText")
              ))
            : t("player.pausedText")}
        </h2>
      </div>
      <div className="truncate text-foreground-secondary text-sm">
        {roomPlayingStarted
          ? track?.artists.map(({ name }) => name).join(", ") ||
            (fetching ? (
              <span className="block h-4 w-32 mx-auto bg-foreground-tertiary rounded-full animate-pulse" />
            ) : (
              t("player.noneHelpText")
            ))
          : t("player.pausedHelpText")}
      </div>
      {track && (
        <TrackMenu id={track.id} active={activeMenu} close={closeMenu} />
      )}
    </div>
  );
};

const PlayerEmbeddedControl: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { t } = useI18n();

  const {
    player,
    state: { playingRoomId, playerPlaying, originalTrack },
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

  const roomPlayingStarted = playingRoomId === roomId;

  const track = useMemo(
    () => (roomPlayingStarted ? playerPlaying || originalTrack : null),
    [playerPlaying, originalTrack, roomPlayingStarted]
  );

  return (
    <>
      <div className="flex items-center">
        <div className="w-32 h-32">
          <div className="pb-full h-0 relative mx-auto bg-background-secondary overflow-hidden">
            {track && (
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt={`${t("nowPlaying.title")}: ${track.title}`}
                src={track.image}
              />
            )}
          </div>
        </div>
        <div className="w-24 h-24 flex flex-center -ml-12 z-10">
          <button
            type="button"
            aria-label={isPlaying ? t("player.pause") : t("player.play")}
            className={`${
              !playerPlaying && roomPlayingStarted ? "hidden" : "flex"
            } flex-center w-16 h-16 rounded-full bg-white text-black transform hover:scale-105 transition-transform duration-300`}
            onClick={() => {
              if (!roomPlayingStarted) return playRoom(roomId);
              isPlaying ? player.pause() : player.play();
            }}
          >
            {isPlaying ? (
              <SvgPause className="ml-1 w-6 h-6 fill-current" />
            ) : (
              <SvgPlay className="ml-1 w-6 h-6 fill-current" />
            )}
          </button>
        </div>
        <div
          aria-label={t("player.label.nameAndArtist")}
          className="flex-1 w-0 p-4 flex flex-col justify-center relative"
        >
          <NowPlayingMeta roomId={roomId} track={track} />
          <NowPlayingReaction id={roomId} />
          <PlayerMenu roomId={roomId} />
        </div>
      </div>
      <ErrorOverlay />
    </>
  );
};

export default PlayerEmbeddedControl;
