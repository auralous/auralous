import React, { useState, useEffect, useMemo } from "react";
import usePlayer from "./usePlayer";
import { useModal } from "~/components/Modal";
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
import {
  SvgPlay,
  SvgPause,
  SvgAlertCircle,
  SvgMusic,
  SvgSkipForward,
} from "~/assets/svg";

const PlayerErrorBar: React.FC = () => {
  const { t } = useI18n();

  const {
    state: { error, originalTrack, playingPlatform },
  } = usePlayer();
  if (!error) return null;
  return (
    <p className="text-xs px-2 bg-danger-light">
      <SvgAlertCircle width="12" className="inline" />{" "}
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

const PlayerSkipNowPlaying: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { t } = useI18n();

  const [{ data: { room } = { room: undefined } }] = useRoomQuery({
    variables: { id: roomId },
  });

  const user = useCurrentUser();
  const [nowPlaying] = useNowPlaying(roomId);
  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();
  return (
    <button
      className="button text-xs py-1 px-2 leading-none"
      onClick={() => skipNowPlaying({ id: roomId })}
      disabled={
        fetching ||
        !user ||
        !nowPlaying?.currentTrack ||
        (user.id !== room?.creatorId &&
          nowPlaying?.currentTrack?.creatorId !== user.id)
      }
      title={t("nowPlaying.skipSong")}
    >
      <SvgSkipForward width="14" height="14" />
    </button>
  );
};

const PlayerTrackMenu: React.FC<{ track: Track | null | undefined }> = ({
  track,
}) => {
  const { t } = useI18n();
  const [activeMenu, openMenu, closeMenu] = useModal();

  return (
    <>
      <button
        className="button mr-1 text-xs py-1 px-2 leading-none"
        onClick={openMenu}
        title={t("player.trackInfo")}
        disabled={!track}
      >
        <SvgMusic width="14" height="14" />
      </button>
      {track && (
        <TrackMenu id={track.id} active={activeMenu} close={closeMenu} />
      )}
    </>
  );
};

const PlayerMenu: React.FC<{
  roomId: string;
  track: Track | null | undefined;
}> = ({ roomId, track }) => {
  return (
    <div className="absolute top-0 right-0 p-1">
      <PlayerTrackMenu track={track} />
      <PlayerSkipNowPlaying roomId={roomId} />
    </div>
  );
};

const NowPlayingMeta: React.FC<{
  roomId: string;
  track: Track | null | undefined;
}> = ({ roomId, track }) => {
  const { t } = useI18n();
  const {
    state: { fetching, playingRoomId },
  } = usePlayer();

  const roomPlayingStarted = playingRoomId === roomId;

  return (
    <div className="mb-1">
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
      <div className="truncate text-foreground-secondary text-sm">
        {roomPlayingStarted
          ? track?.artists.map(({ name }) => name).join(", ") ||
            (fetching ? (
              <span className="block h-4 w-32 bg-foreground-tertiary rounded-full animate-pulse" />
            ) : (
              t("player.noneHelpText")
            ))
          : t("player.pausedHelpText")}
      </div>
    </div>
  );
};

const PlayerEmbeddedControl: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { t } = useI18n();

  const {
    player,
    state: { playingRoomId, playerPlaying, originalTrack, playingThemeColor },
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
      <div
        className="flex items-center relative"
        style={{ backgroundColor: playingThemeColor }}
      >
        <div className="bg-black absolute inset-0" style={{ opacity: ".15" }} />
        <div className="w-24 h-24 lg:w-32 lg:h-32">
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
        <div className="w-16 h-24 flex flex-center -ml-8 z-10">
          <button
            type="button"
            aria-label={isPlaying ? t("player.pause") : t("player.play")}
            className={`${
              !playerPlaying && roomPlayingStarted ? "hidden" : "flex"
            } flex-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white transform hover:scale-105 transition-transform duration-300`}
            onClick={() => {
              if (!roomPlayingStarted) return playRoom(roomId);
              isPlaying ? player.pause() : player.play();
            }}
            style={{ color: playingThemeColor }}
          >
            {isPlaying && roomPlayingStarted ? (
              <SvgPause className="w-6 h-6 fill-current" />
            ) : (
              <SvgPlay className="w-6 h-6 fill-current" />
            )}
          </button>
        </div>
        <div
          aria-label={t("player.label.nameAndArtist")}
          className="flex-1 w-0 p-2 lg:p-4 flex flex-col justify-center relative"
        >
          <NowPlayingMeta roomId={roomId} track={track} />
          <div className="max-w-sm overflow-x-auto">
            <NowPlayingReaction id={roomId} />
            <PlayerMenu roomId={roomId} track={track} />
          </div>
        </div>
      </div>
      <PlayerErrorBar />
    </>
  );
};

export default PlayerEmbeddedControl;
