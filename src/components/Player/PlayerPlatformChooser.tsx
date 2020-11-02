import React from "react";
import { Modal } from "~/components/Modal";
import { PlatformName } from "~/graphql/gql.gen";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useLogin } from "~/components/Auth";
import { SvgLogIn, SvgSpotify, SvgYoutube } from "~/assets/svg";

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
            Join Stereo or Select a Music Service
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Content className="flex flex-col items-center">
        <button
          onClick={showLogin}
          className="w-48 m-1 text-sm button rounded-full"
        >
          <SvgLogIn width="24" />
          <span className="ml-2 text-sm">Join Stereo</span>
        </button>
        <div className="text-foreground-secondary flex justify-between items-center max-w-full w-72">
          <hr className="flex-1" />
          <p className="px-2 text-sm py-4">Listen as guest</p>
          <hr className="flex-1" />
        </div>
        <button
          onClick={() => selectPlatform(PlatformName.Youtube)}
          className="w-48 m-1 button rounded-full text-sm opacity-75 hover:opacity-100 transition-opacity duration-200 brand-youtube"
        >
          <SvgYoutube width="24" className="fill-current" strokeWidth="0" />
          <span className="ml-2 text-sm">Listen on YouTube</span>
        </button>
        <button
          onClick={() => selectPlatform(PlatformName.Spotify)}
          className="w-48 m-1 button rounded-full text-sm opacity-75 hover:opacity-100 transition-opacity duration-200 brand-spotify"
        >
          <SvgSpotify width="24" className="fill-current" strokeWidth="0" />
          <span className="ml-2 text-sm">Listen on Spotify</span>
        </button>
        <button
          onClick={stopPlaying}
          className="button mt-2 text-xs bg-transparent opacity-75 hover:opacity-100 transition-opacity"
        >
          Stop Playing
        </button>
        <div className="text-foreground-tertiary text-xs mt-6 container">
          <p className="text-center max-w-3xl w-full mx-auto">
            You can either temporarily listen on one of the music providers
            above, or join Stereo for free and access features like add songs to
            and from from your playlists, react to your friends&apos; picks, and
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
