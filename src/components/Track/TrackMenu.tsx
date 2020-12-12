import React, { useState } from "react";
import { AddToPlaylist } from "~/components/Playlist/index";
import { SvgPlus } from "~/assets/svg";
import { useTrackQuery } from "~/graphql/gql.gen";
import { SvgByPlatformName, PLATFORM_FULLNAMES } from "~/lib/constants";
import { useI18n } from "~/i18n/index";
import { Modal } from "~/components/Modal";

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
          <div className="flex-center flex flex-col sm:flex-row">
            <img
              className="w-32 h-32 object-cover rounded shadow-lg mr-4"
              src={track?.image}
              alt={track?.title}
            />
            <div className="w-full sm:w-0 flex-1">
              <div className="py-2 mb-2 text-center sm:text-left">
                <div className="text-md mb-1 leading-tight font-bold truncate">
                  {track?.title}
                </div>
                <div className="text-sm text-foreground-secondary truncate">
                  {track?.artists.map(({ name }) => name).join(", ")}
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start">
                <button
                  className="btn text-xs m-1"
                  onClick={() => setOpenAddPlaylist(true)}
                >
                  <SvgPlus width="20" className="mr-1" />{" "}
                  {t("track.addToPlaylist")}
                </button>
                <a
                  href={track?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text-xs m-1"
                >
                  {SvgPlatformName && (
                    <SvgPlatformName width="20" className="fill-current" />
                  )}
                  <span className="ml-2">
                    {t("track.listenOn", {
                      platform:
                        (track?.platform &&
                          PLATFORM_FULLNAMES[track.platform]) ||
                        "",
                    })}
                  </span>
                </a>
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
