import { SvgPlus } from "assets/svg";
import { Modal } from "components/Modal";
import { AddToPlaylist } from "components/Playlist/index";
import { Button } from "components/Pressable";
import { useTrackQuery } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useState } from "react";
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
          <div className="flex-center flex flex-col md:flex-row">
            <img
              className="w-32 h-32 object-cover rounded shadow-lg mr-4"
              src={track?.image}
              alt={track?.title}
            />
            <div className="w-full md:w-0 flex-1">
              <div className="py-2 mb-2 text-center md:text-left">
                <div className="text-md mb-1 leading-tight font-bold truncate">
                  {track?.title}
                </div>
                <div className="text-sm text-foreground-secondary truncate">
                  {track?.artists.map(({ name }) => name).join(", ")}
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start space-x-1">
                <Button
                  onPress={() => setOpenAddPlaylist(true)}
                  icon={<SvgPlus width="20" />}
                  title={t("track.addToPlaylist")}
                />
                <Button
                  asLink={track?.url}
                  icon={
                    SvgPlatformName ? (
                      <SvgPlatformName width="20" className="fill-current" />
                    ) : undefined
                  }
                  title={t("track.listenOn", {
                    platform:
                      (track?.platform && PLATFORM_FULLNAMES[track.platform]) ||
                      "",
                  })}
                />
              </div>
            </div>
          </div>
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
