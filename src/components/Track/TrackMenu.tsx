import React, { useState } from "react";
import { DialogOverlay } from "@reach/dialog";
import AddToPlaylistModal from "~/components/Playlist/AddToPlaylist";
import { SvgPlus, SvgX } from "~/assets/svg";
import { useTrackQuery } from "~/graphql/gql.gen";
import { SvgByPlatformName, PLATFORM_FULLNAMES } from "~/lib/constants";

const TrackMenu: React.FC<{
  id: string;
  active: boolean;
  close: () => void;
}> = ({ id, active, close }) => {
  const [openAddPlaylist, setOpenAddPlaylist] = useState(false);
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id },
  });
  const SvgPlatformName = track?.platform
    ? SvgByPlatformName[track.platform]
    : null;
  return (
    <DialogOverlay isOpen={active}>
      <div
        className="flex flex-col m-2 items-center p-8 bg-white bg-opacity-10 rounded-lg text-center overflow-hidden"
        style={{
          backdropFilter: "blur(12px)",
        }}
      >
        <h3 className="text-xl mb-1 leading-tight font-bold text-center truncate w-full">
          {track?.title}
        </h3>
        <div className="text-sm mb-3 text-foreground-secondary w-full">
          {track?.artists.map(({ name }) => name).join(", ")}
        </div>
        <button
          className="button bg-transparent text-sm mb-2"
          onClick={() => setOpenAddPlaylist(true)}
        >
          <SvgPlus width="20" className="mr-1" /> Add to playlist
        </button>
        <a
          href={track?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="button bg-transparent text-sm mb-2"
        >
          {SvgPlatformName && (
            <SvgPlatformName width="20" fill="currentColor" />
          )}
          <span className="ml-2 text-xs">
            Listen on {track?.platform && PLATFORM_FULLNAMES[track.platform]}
          </span>
        </a>
        <button
          onClick={close}
          className="button bg-transparent rounded-full text-sm"
          aria-label="Close track dialog"
        >
          <SvgX width="20" className="mr-1" /> Close
        </button>
      </div>
      {track && (
        <AddToPlaylistModal
          active={openAddPlaylist}
          close={() => {
            setOpenAddPlaylist(false);
          }}
          track={track}
        />
      )}
    </DialogOverlay>
  );
};

export default TrackMenu;
