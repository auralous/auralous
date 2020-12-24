import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTransition, animated } from "react-spring";
import usePlayer from "./usePlayer";
import { useI18n } from "~/i18n/index";
import {
  SvgPause,
  SvgPlay,
  SvgSkipBack,
  SvgSkipForward,
  SvgX,
} from "~/assets/svg";

const noPlayerMinibarRoutes = ["/listen"];

const SkipButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  title: string;
}> = ({ children, onClick, disabled, title }) => (
  <button
    className="btn btn-transparent p-3"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

const PlayButton: React.FC = () => {
  const { t } = useI18n();

  const {
    player,
    state: { playerPlaying },
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

  return (
    <button
      aria-label={isPlaying ? t("player.pause") : t("player.play")}
      className="btn btn-primary w-10 h-10 rounded-full p-2"
      onClick={() => (isPlaying ? player.pause() : player.play())}
      disabled={!playerPlaying}
    >
      {isPlaying ? (
        <SvgPause className="w-3 h-3 fill-current" />
      ) : (
        <SvgPlay className="w-3 h-3 fill-current" />
      )}
    </button>
  );
};

const PlayerMinibarStory: React.FC<{ style: React.CSSProperties }> = ({
  style,
}) => {
  const { t } = useI18n();
  const { skipForward, skipBackward } = usePlayer();
  return (
    <div className="w-full h-full inset-0 gap-4 flex flex-center" style={style}>
      <SkipButton
        title={t("player.skipBackward")}
        onClick={skipBackward}
        disabled={!skipBackward}
      >
        <SvgSkipBack className="w-4 h-4 fill-current stroke-current" />
      </SkipButton>
      <PlayButton />
      <SkipButton
        title={t("player.skipForward")}
        onClick={skipForward}
        disabled={!skipForward}
      >
        <SvgSkipForward className="w-4 h-4 fill-current stroke-current" />
      </SkipButton>
    </div>
  );
};

const PlayerMinibarApp: React.FC<{ style: React.CSSProperties }> = ({
  style,
}) => {
  const { t } = useI18n();
  const {
    state: { playingStoryId, playerPlaying },
    playStory,
  } = usePlayer();
  return (
    <div className="w-full h-full inset-0 flex items-center" style={style}>
      <Link href={`/story/${playingStoryId}`}>
        <a className="flex-1 w-0 flex items-center">
          <div className="w-14 h-14 p-2">
            {playerPlaying && (
              <img
                alt={t("nowPlaying.title")}
                src={playerPlaying.image}
                className="h-full w-full object-cover rounded"
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
        onClick={() => playStory("")}
        className="btn btn-transparent p-2"
        title={t("player.stopPlaying")}
      >
        <SvgX />
      </button>
    </div>
  );
};

const AnimatedPlayerMinibarStory = animated(PlayerMinibarStory);
const AnimatedPlayerMinibarApp = animated(PlayerMinibarApp);

const PlayerMinibar: React.FC = () => {
  const router = useRouter();
  const {
    state: { playingStoryId },
  } = usePlayer();

  const show = useMemo<"" | "app" | "story">(() => {
    if (!playingStoryId || noPlayerMinibarRoutes.includes(router.pathname))
      return "";
    if (router.pathname === "/story/[storyId]") return "story";
    return "app";
  }, [router, playingStoryId]);

  const transitions = useTransition(show, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div
      hidden={show === ""}
      className="fixed sm:pl-48 h-14 z-10 w-full bottom-10 sm:bottom-0"
    >
      {transitions.map(({ props, key }) =>
        show === "app" ? (
          <AnimatedPlayerMinibarApp key={key} style={props} />
        ) : show === "story" ? (
          <AnimatedPlayerMinibarStory key={key} style={props} />
        ) : null
      )}
    </div>
  );
};

export default PlayerMinibar;
