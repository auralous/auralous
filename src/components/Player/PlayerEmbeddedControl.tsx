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
  useRoomStateQuery,
  useSkipNowPlayingMutation,
} from "~/graphql/gql.gen";
import {
  SvgPlay,
  SvgPause,
  SvgAlertCircle,
  SvgSkipForward,
} from "~/assets/svg";
import PlayerPlatformChooser from "./PlayerPlatformChooser";

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

  const user = useCurrentUser();
  const [nowPlaying] = useNowPlaying(roomId);
  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();

  const [
    { data: { roomState } = { roomState: undefined } },
  ] = useRoomStateQuery({ variables: { id: roomId } });

  return (
    <button
      className="button text-xs leading-none"
      onClick={() => skipNowPlaying({ id: roomId })}
      disabled={
        fetching ||
        !user ||
        !nowPlaying?.currentTrack ||
        (!roomState?.permission.queueCanManage &&
          nowPlaying?.currentTrack?.creatorId !== user.id)
      }
      title={t("nowPlaying.skipSong")}
    >
      <SvgSkipForward width="14" height="14" className="fill-current" />
    </button>
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
  const [activeMenu, openMenu, closeMenu] = useModal();

  return (
    <>
      <div className="mb-1 flex flex-col items-start">
        <div
          role="link"
          className="font-bold text-lg leading-tight truncate cursor-pointer hover:bg-background-secondary focus:outline-none max-w-full"
          onClick={() => track && openMenu()}
          tabIndex={0}
          onKeyDown={({ key }) => key === "Enter" && track && openMenu()}
        >
          {roomPlayingStarted
            ? track?.title ||
              (fetching ? (
                <span className="block mb-1 h-5 w-40 bg-foreground-tertiary rounded-full animate-pulse" />
              ) : (
                t("player.noneText")
              ))
            : t("player.pausedText")}
        </div>
        <div className="truncate text-foreground-secondary text-sm max-w-full">
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
      {track && (
        <TrackMenu id={track.id} active={activeMenu} close={closeMenu} />
      )}
    </>
  );
};

const PlayerEmbeddedControl: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { t } = useI18n();

  const {
    player,
    state: { playingPlatform, playingRoomId, playerPlaying, originalTrack },
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

  // Should only show platform chooser if there is an ongoing track and no playingPlatform can be determined
  const shouldShowPlatformChooser = useMemo<boolean>(
    () => !playingPlatform && !!track,
    [playingPlatform, track]
  );

  return (
    <>
      <div
        className={`${
          shouldShowPlatformChooser ? "hidden" : "flex"
        } items-center relative transition-colors`}
      >
        <div className="absolute inset-0" style={{ opacity: ".15" }} />
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
            aria-label={isPlaying ? t("player.pause") : t("player.play")}
            className="opacity-100 flex flex-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white text-blue-tertiary transform hover:scale-105 transition-transform"
            onClick={() => {
              if (!roomPlayingStarted) return playRoom(roomId);
              isPlaying ? player.pause() : player.play();
            }}
            disabled={!playerPlaying && roomPlayingStarted}
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
          <div className="max-w-md overflow-x-auto flex items-center">
            <PlayerSkipNowPlaying roomId={roomId} />
            <div className="flex-1 w-0 ml-1">
              <NowPlayingReaction id={roomId} />
            </div>
          </div>
        </div>
      </div>
      <PlayerErrorBar />
      {shouldShowPlatformChooser && <PlayerPlatformChooser />}
    </>
  );
};

export default PlayerEmbeddedControl;
