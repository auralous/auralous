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
import { useCurrentUser, useMAuth } from "~/hooks/user";
import {
  Track,
  useStoryStateQuery,
  useSkipNowPlayingMutation,
} from "~/graphql/gql.gen";
import {
  SvgPlay,
  SvgPause,
  SvgAlertCircle,
  SvgSkipForward,
} from "~/assets/svg";
import { useLogin } from "../Auth";

const PlayerSkipNowPlaying: React.FC<{ storyId: string }> = ({ storyId }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const [nowPlaying] = useNowPlaying(storyId);
  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();

  const [
    { data: { storyState } = { storyState: undefined } },
  ] = useStoryStateQuery({ variables: { id: storyId } });

  return (
    <button
      className="btn text-xs leading-none"
      onClick={() => skipNowPlaying({ id: storyId })}
      disabled={
        fetching ||
        !user ||
        !nowPlaying?.currentTrack ||
        (!storyState?.permission.queueCanManage &&
          nowPlaying?.currentTrack?.creatorId !== user.id)
      }
      title={t("nowPlaying.skipSong")}
    >
      <SvgSkipForward width="14" height="14" className="fill-current" />
    </button>
  );
};

const NowPlayingMeta: React.FC<{
  storyId: string;
  track: Track | null | undefined;
}> = ({ storyId, track }) => {
  const { t } = useI18n();
  const {
    state: { fetching, playingStoryId },
  } = usePlayer();

  const storyPlayingStarted = playingStoryId === storyId;
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
          {storyPlayingStarted
            ? track?.title ||
              (fetching ? (
                <span className="block mb-1 h-5 w-40 bg-foreground-tertiary rounded-full animate-pulse" />
              ) : (
                t("player.noneText")
              ))
            : t("player.pausedText")}
        </div>
        <div className="truncate text-foreground-secondary text-sm max-w-full">
          {storyPlayingStarted
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

const PlayerEmbeddedControl: React.FC<{ storyId: string }> = ({ storyId }) => {
  const { t } = useI18n();

  const {
    player,
    state: { playingStoryId, playerPlaying, crossTracks },
    playStory,
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

  const storyPlayingStarted = playingStoryId === storyId;

  const track = useMemo(
    () => (storyPlayingStarted ? playerPlaying || crossTracks?.original : null),
    [playerPlaying, crossTracks, storyPlayingStarted]
  );

  return (
    <>
      <div className="flex items-center relative transition-colors">
        {track && (
          <img
            className="absolute inset-0 transform scale-125 w-full h-full object-cover"
            alt={`${t("nowPlaying.title")}: ${track.title}`}
            src={track.image}
            style={{ filter: "blur(20px) brightness(.7)" }}
          />
        )}
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
              if (!storyPlayingStarted) return playStory(storyId);
              isPlaying ? player.pause() : player.play();
            }}
            disabled={!playerPlaying && storyPlayingStarted}
          >
            {isPlaying && storyPlayingStarted ? (
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
          <NowPlayingMeta storyId={storyId} track={track} />
          <div className="max-w-md overflow-x-auto flex items-center">
            <PlayerSkipNowPlaying storyId={storyId} />
            <div className="flex-1 w-0 ml-1">
              <NowPlayingReaction id={storyId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const PlayerEmbeddedNotification: React.FC = () => {
  const { data: mAuth, isLoading: isLoadingMAuth } = useMAuth();
  const {
    state: { playingPlatform, crossTracks, playerPlaying },
  } = usePlayer();
  const { t } = useI18n();

  const [, logIn] = useLogin();

  const shouldSuggestSignIn = !isLoadingMAuth && !mAuth;
  const isNotAvailable = !!crossTracks && !playerPlaying;

  if (!isNotAvailable && !shouldSuggestSignIn) return null;

  return (
    <div className="bordered-box rounded-lg p-2">
      {isNotAvailable && (
        <p className="text-xs">
          <SvgAlertCircle width="12" height="12" className="inline mr-1" />
          <b>{crossTracks?.original?.title}</b> {t("player.noCrossTrackText")}{" "}
          {PLATFORM_FULLNAMES[playingPlatform]}
        </p>
      )}
      {shouldSuggestSignIn && (
        <p className="text-xs">
          {`💡 ${t("player.signInSuggest")}`}{" "}
          <button
            className="font-bold hover:opacity-75 btn py-0 px-2 text-xs"
            onClick={logIn}
          >
            {t("common.signIn")}
          </button>
        </p>
      )}
    </div>
  );
};

export default PlayerEmbeddedControl;
