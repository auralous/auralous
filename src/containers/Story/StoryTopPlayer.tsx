import { Skeleton } from "components/Loading";
import { usePlayer } from "components/Player";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n";

const StoryTopPlayer: React.FC<{
  onPress(): void;
  hidden: boolean;
}> = ({ hidden, onPress }) => {
  const { t } = useI18n();

  const {
    state: { crossTracks, fetching },
  } = usePlayer();

  const track = crossTracks?.original;

  return (
    <Box
      fullWidth
      paddingX="sm"
      height={hidden ? 0 : undefined}
      style={{ overflow: "hidden", cursor: "pointer", outlineWidth: 0 }}
      onPress={onPress}
    >
      <Box
        alignItems="center"
        row
        gap="xs"
        backgroundColor="background-secondary"
        padding="xs"
        rounded="lg"
      >
        <Box
          width={12}
          height={12}
          rounded="lg"
          style={{ boxSizing: "content-box", overflow: "hidden" }}
        >
          <Skeleton show={fetching} width={12} height={12}>
            {track && (
              <img
                alt={t("nowPlaying.title")}
                src={track.image}
                className="h-12 w-12 object-cover shadow-lg"
              />
            )}
          </Skeleton>
        </Box>
        <Box padding="xs" flex={1} minWidth={0} gap="xs">
          <Skeleton show={fetching} width={40}>
            <Typography.Paragraph size="xs" strong noMargin truncate>
              {track?.title || t("player.noneText")}
            </Typography.Paragraph>
          </Skeleton>
          <Skeleton show={fetching} width={32}>
            <Typography.Paragraph
              noMargin
              truncate
              color="foreground-secondary"
              size="xs"
            >
              {track?.artists.map((artist) => artist.name).join(", ") ||
                t("player.noneHelpText")}
            </Typography.Paragraph>
          </Skeleton>
        </Box>
      </Box>
      <Spacer size={1} axis="vertical" />
    </Box>
  );
};

export default StoryTopPlayer;
