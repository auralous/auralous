import { PlayerImage, PlayerMeta, usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import { StoryNav } from "components/Story";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  Story,
  useNowPlayingQuery,
  useTrackQuery,
  useUserQuery,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import Link from "next/link";
import { onEnterKeyClick } from "utils/util";

const StorySliderView: React.FC<{ story: Story; close: () => void }> = ({
  story,
  close,
}) => {
  const { t } = useI18n();
  const {
    state: { fetching: fetchingPlayer, crossTracks, playingStoryId },
    skipForward,
  } = usePlayer();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: story.id }, pause: !story.isLive });

  const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack,
  });

  // story.isLive === false means fetching because
  // we do not know what is the current track unless
  // user start tuning in (allowing us to know the queue item)
  const fetching = fetchingTrack || fetchingPlayer || story.isLive === false;

  // if story.isLive, show current nowPlaying track
  // otherwise, show playerPlaying/crossTracks (which is queue item)
  const track = story.isLive
    ? dataTrack?.track
    : !fetchingPlayer && playingStoryId === story.id
    ? crossTracks?.original
    : undefined;

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  return (
    <div
      className="p-4 box-border mx-auto max-w-full h-full flex flex-col justify-center"
      style={{ width: 600 }}
    >
      <StoryNav onClose={close} story={story} />
      <div className="relative w-full h-0 flex-1 flex flex-col mx-auto">
        <PlayerImage track={track} />
        <PlayerMeta track={track} fetching={fetching && !track} />
        {/* TODO: a11y */}
        <div
          role="button"
          tabIndex={0}
          className="absolute top-0 left-0 w-full h-full opacity-0"
          aria-label={t("player.skipForward")}
          onClick={skipForward}
          onKeyPress={onEnterKeyClick}
        />
      </div>
      <Box
        fullWidth
        justifyContent="center"
        gap={"xs"}
        style={{ height: "7.125rem" }}
      >
        <Typography.Paragraph
          size="lg"
          color="foreground-secondary"
          align="center"
          noMargin
        >
          {t(story?.isLive ? "listen.promptJoin" : "listen.promptJoinNolive", {
            username: user?.username || "",
          })}
        </Typography.Paragraph>
        <Link href={`/story/${story?.id}`} passHref>
          <Button
            title={
              story?.isLive
                ? t("listen.actionJoin")
                : t("listen.actionJoinNoLive")
            }
            fullWidth
            color="primary"
            asLink
            shape="circle"
          />
        </Link>
      </Box>
    </div>
  );
};

export default StorySliderView;
