import React, { useEffect, useState } from "react";
import { usePlayer } from "~/components/Player";
import { useI18n } from "~/i18n/index";
import { Story } from "~/graphql/gql.gen";
import { SvgPause, SvgPlay, SvgSkipForward, SvgSkipBack } from "~/assets/svg";

const SkipButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  title: string;
}> = ({ children, onClick, disabled, title }) => (
  <button
    className="btn btn-transparent p-2"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

const StoryPlay: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const {
    player,
    state: { playingStoryId, playerPlaying },
    playStory,
  } = usePlayer();

  const [isPlaying, setIsPlaying] = useState(() => player.isPlaying);

  const storyPlayingStarted = playingStoryId === story.id;

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
      onClick={() => {
        if (!storyPlayingStarted) return playStory(story.id);
        isPlaying ? player.pause() : player.play();
      }}
      disabled={!playerPlaying && storyPlayingStarted}
    >
      {isPlaying && storyPlayingStarted ? (
        <SvgPause className="w-3 h-3 fill-current" />
      ) : (
        <SvgPlay className="w-3 h-3 fill-current" />
      )}
    </button>
  );
};

const StoryFooter: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const { skipForward, skipBackward } = usePlayer();
  return (
    <div className="gap-2 w-full fixed sm:absolute bottom-10 sm:bottom-0 h-16 flex flex-center py-2 bg-black">
      <SkipButton
        title={t("player.skipBackward")}
        onClick={skipBackward}
        disabled={!skipBackward}
      >
        <SvgSkipBack className="w-4 h-4 fill-current stroke-current" />
      </SkipButton>
      <StoryPlay story={story} />
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

export default StoryFooter;
