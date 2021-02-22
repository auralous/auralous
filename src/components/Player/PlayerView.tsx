import { SvgPause, SvgPlay, SvgSkipBack, SvgSkipForward } from "assets/svg";
import { Skeleton } from "components/Loading";
import { useModal } from "components/Modal";
import { Button } from "components/Pressable";
import { TrackMenu } from "components/Track";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { Track } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

const EMPTYIMAGE = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP87wMAAlABTQluYBcAAAAASUVORK5CYII=
`;

export const PlayerControl: React.FC = () => {
  const { t } = useI18n();
  const {
    player,
    state: { playerPlaying, fetching },
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
  const { skipForward, skipBackward } = usePlayer();

  return (
    <Box paddingY={1} row justifyContent="center" alignItems="center" gap="lg">
      <Button
        accessibilityLabel={t("player.skipBackward")}
        onPress={skipBackward}
        disabled={!skipBackward}
        icon={<SvgSkipBack className="w-6 h-6 fill-current stroke-current" />}
        styling="link"
      />
      <Box position="relative">
        <Button
          accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
          icon={
            isPlaying ? (
              <SvgPause className="w-8 h-8 fill-current" />
            ) : (
              <SvgPlay className="w-8 h-8 fill-current" />
            )
          }
          onPress={() => (isPlaying ? player.pause() : player.play())}
          disabled={!playerPlaying}
          size="xl"
          shape="circle"
        />
        {fetching && <span className="spinning-border absolute inset-0" />}
      </Box>
      <Button
        accessibilityLabel={t("player.skipForward")}
        onPress={skipForward}
        disabled={!skipForward}
        icon={
          <SvgSkipForward className="w-6 h-6 fill-current stroke-current" />
        }
        styling="link"
      />
    </Box>
  );
};

export const PlayerImage: React.FC<{
  track: Track | null | undefined;
}> = ({ track }) => {
  return (
    <div className="w-full my-6 flex-1 h-0">
      <div
        className="object-contain h-full"
        role="img"
        title={track?.title}
        style={{
          background: `url(${
            track?.image || EMPTYIMAGE
          }) center center / contain no-repeat`,
        }}
      />
    </div>
  );
};

export const PlayerMeta: React.FC<{
  fetching: boolean;
  track: Track | null | undefined;
}> = ({ fetching, track }) => {
  const { t } = useI18n();

  const [activeMenu, openMenu, closeMenu] = useModal();
  useEffect(closeMenu, [track, closeMenu]);

  return (
    // eslint-disable-next-line
    <div className="text-inline-link w-full" onClick={openMenu} >
      <Box fullWidth alignItems="stretch" gap="xs" style={{ lineHeight: 1 }}>
        <Skeleton rounded="lg" show={fetching} width={40}>
          <Typography.Title
            align="left"
            noMargin
            level={4}
            strong
            size="2xl"
            truncate
          >
            {track ? track.title : t("player.noneText")}
          </Typography.Title>
        </Skeleton>
        <Skeleton rounded="lg" show={fetching} width={32}>
          <Typography.Paragraph
            align="left"
            noMargin
            color="foreground-secondary"
            truncate
          >
            {track
              ? track.artists.map((artist) => artist.name).join(", ")
              : t("player.noneHelpText")}
          </Typography.Paragraph>
        </Skeleton>
        {track && (
          <TrackMenu active={activeMenu} close={closeMenu} id={track.id} />
        )}
      </Box>
    </div>
  );
};
