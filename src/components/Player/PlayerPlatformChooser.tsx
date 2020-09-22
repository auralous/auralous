import React from "react";
import { Modal } from "~/components/Modal";
import { SvgSpotify, SvgYoutube } from "~/assets/svg";
import { PlatformName } from "~/graphql/gql.gen";
import Link from "next/link";
import usePlayer from "./usePlayer";

const PlayerPlatformChooser: React.FC<{
  active: boolean;
  onSelect: () => void;
}> = ({ active, onSelect }) => {
  const { stopPlaying } = usePlayer();

  const selectPlatform = (platform: PlatformName) => {
    window.sessionStorage.setItem("playingPlatform", platform);
    onSelect();
  };

  return (
    <Modal.Modal title="Choose platform to play this track on" active={active}>
      <Modal.Header>
        <Modal.Title>
          <span className="text-center w-full">
            Select music streaming service
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Content className="flex flex-col items-center">
        <button
          onClick={() => selectPlatform(PlatformName.Youtube)}
          className="button opacity-75 hover:opacity-100 transition-opacity duration-200 flex mb-2 brand-youtube h-12"
        >
          <SvgYoutube width="24" fill="currentColor" strokeWidth="0" />
          <span className="ml-2 text-sm">Listen on YouTube</span>
        </button>
        <button
          onClick={() => selectPlatform(PlatformName.Spotify)}
          className="button opacity-75 hover:opacity-100 transition-opacity duration-200 flex brand-spotify h-12"
        >
          <SvgSpotify width="24" fill="currentColor" strokeWidth="0" />
          <span className="ml-2 text-sm">Listen on Spotify</span>
        </button>
        <button
          onClick={stopPlaying}
          className="button mt-2 text-sm bg-transparent opacity-75 hover:opacity-100 transition-opacity"
        >
          Stop Playing
        </button>
        <div className="text-foreground-tertiary text-xs mt-6">
          You can change you music streaming service at any time in{" "}
          <Link href="/settings">
            <button className="underline" onClick={stopPlaying}>
              Settings
            </button>
          </Link>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default PlayerPlatformChooser;
