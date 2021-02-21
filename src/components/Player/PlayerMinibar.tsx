import { SvgPause, SvgPlay, SvgX } from "assets/svg";
import { Skeleton } from "components/Loading";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

const PlayerMinibar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    state: { playingStoryId, playerPlaying, fetching },
    playStory,
    player,
  } = usePlayer();

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

  const [isPlaying, setIsPlaying] = useState(() => player.isPlaying);

  if (!playingStoryId || router.pathname === "/story/[storyId]") return null;

  return (
    <div className="flex fixed z-10 w-full bottom-10 md:bottom-0 border-t-4 border-primary items-center box-content space-x-1 bg-background">
      <Link href={`/story/${playingStoryId}`}>
        <a className="flex-1 w-0 flex items-center">
          <Box
            width={12}
            height={12}
            padding={1}
            style={{ boxSizing: "content-box" }}
          >
            <Skeleton show={fetching} rounded="full">
              {!fetching && playerPlaying && (
                <img
                  alt={t("nowPlaying.title")}
                  src={playerPlaying.image}
                  className="h-12 w-12 object-cover rounded-full shadow-lg"
                />
              )}
            </Skeleton>
          </Box>
          <Box padding={2} flex={1} minWidth={0} gap="xs">
            <Skeleton show={fetching} width={40} rounded="lg">
              <Typography.Paragraph size="xs" strong noMargin truncate>
                {playerPlaying?.title || t("player.noneText")}
              </Typography.Paragraph>
            </Skeleton>
            <Skeleton show={fetching} width={32} rounded="lg">
              <Typography.Paragraph
                noMargin
                truncate
                color="foreground-secondary"
                size="xs"
              >
                {playerPlaying?.artists
                  .map((artist) => artist.name)
                  .join(", ") || t("player.noneHelpText")}
              </Typography.Paragraph>
            </Skeleton>
          </Box>
        </a>
      </Link>
      <Button
        accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
        onPress={() => (isPlaying ? player.pause() : player.play())}
        icon={
          isPlaying ? (
            <SvgPause className="fill-current" />
          ) : (
            <SvgPlay className="fill-current" />
          )
        }
        styling="link"
      />
      <Button
        accessibilityLabel={t("player.stopPlaying")}
        onPress={() => playStory("")}
        icon={<SvgX />}
        styling="link"
      />
    </div>
  );
};

export default PlayerMinibar;
