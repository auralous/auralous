import { SvgPlus } from "assets/svg";
import { Modal } from "components/Modal";
import { AddToPlaylist } from "components/Playlist/index";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useTrackQuery } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useState } from "react";
import { PLATFORM_FULLNAMES, SvgByPlatformName } from "utils/constants";

const TrackMenu: React.FC<{
  id: string;
  active: boolean;
  close: () => void;
}> = ({ id, active, close }) => {
  const { t } = useI18n();
  const [openAddPlaylist, setOpenAddPlaylist] = useState(false);
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id },
  });
  const SvgPlatformName = track?.platform
    ? SvgByPlatformName[track.platform]
    : null;

  return (
    <>
      <Modal.Modal
        title={`${track?.artists.map(({ name }) => name).join(", ")} - ${
          track?.title
        }`}
        active={active}
        close={close}
      >
        <Modal.Content>
          <Box justifyContent="center" alignItems="center">
            <img
              className="w-32 h-32 object-cover rounded shadow-lg"
              src={track?.image}
              alt={track?.title}
            />
            <Spacer size={4} axis="vertical" />
            <Typography.Paragraph size="md" truncate strong noMargin>
              {track?.title}
            </Typography.Paragraph>
            <Typography.Paragraph
              size="sm"
              truncate
              color="foreground-secondary"
            >
              {track?.artists.map(({ name }) => name).join(", ")}
            </Typography.Paragraph>
            <Box gap="sm">
              <Button
                onPress={() => setOpenAddPlaylist(true)}
                icon={<SvgPlus width="20" height="20" />}
                title={t("track.addToPlaylist")}
              />
              <Button
                asLink={track?.url}
                icon={
                  SvgPlatformName ? (
                    <SvgPlatformName
                      width="20"
                      height="20"
                      className="fill-current"
                    />
                  ) : undefined
                }
                title={t("track.listenOn", {
                  platform:
                    (track?.platform && PLATFORM_FULLNAMES[track.platform]) ||
                    "",
                })}
              />
            </Box>
          </Box>
        </Modal.Content>
      </Modal.Modal>
      <AddToPlaylist
        active={openAddPlaylist}
        close={() => {
          setOpenAddPlaylist(false);
        }}
        trackId={id}
      />
    </>
  );
};

export default TrackMenu;
