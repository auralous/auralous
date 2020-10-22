import React from "react";
import { Modal } from "~/components/Modal";
import { PlatformName } from "~/graphql/gql.gen";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useLogin } from "~/components/Auth";
import { SvgSpotify, SvgYoutube } from "~/assets/svg";

const PlayerPlatformChooser: React.FC<{
  active: boolean;
  onSelect: () => void;
}> = ({ active, onSelect }) => {
  const { stopPlaying } = usePlayer();

  const selectPlatform = (platform: PlatformName) => {
    window.sessionStorage.setItem("playingPlatform", platform);
    onSelect();
  };

  const [, showLogin] = useLogin();

  return (
    <Modal.Modal title="Choose platform to play this track on" active={active}>
      <Modal.Header>
        <Modal.Title>
          <span className="text-center w-full">
            Sign in or select a music service
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Content className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row mb-2">
          <button
            onClick={showLogin}
            className="w-48 m-1 text-sm button rounded-full"
          >
            Sign in to Stereo
          </button>
          <button
            onClick={() => selectPlatform(PlatformName.Youtube)}
            className="w-48 m-1 button rounded-full text-sm opacity-75 hover:opacity-100 transition-opacity duration-200 brand-youtube"
          >
            <SvgYoutube width="24" fill="currentColor" strokeWidth="0" />
            <span className="ml-2 text-sm">Listen on YouTube</span>
          </button>
          <button
            onClick={() => selectPlatform(PlatformName.Spotify)}
            className="w-48 m-1 button rounded-full text-sm opacity-75 hover:opacity-100 transition-opacity duration-200 brand-spotify"
          >
            <SvgSpotify width="24" fill="currentColor" strokeWidth="0" />
            <span className="ml-2 text-sm">Listen on Spotify</span>
          </button>
        </div>
        <button
          onClick={stopPlaying}
          className="button mt-2 text-xs bg-transparent opacity-75 hover:opacity-100 transition-opacity"
        >
          Stop Playing
        </button>
        <div className="text-foreground-tertiary text-xs mt-6 container">
          <p className="text-center">
            Join Stereo allows you to add songs from and to your playlists and
            more. Otherwise, you can change your choice at any time in{" "}
            <Link href="/settings">
              <button className="underline" onClick={stopPlaying}>
                Settings
              </button>
            </Link>
            .
          </p>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default PlayerPlatformChooser;
