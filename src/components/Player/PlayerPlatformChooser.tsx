import React, { useMemo } from "react";
import { Modal } from "~/components/Modal";
import { PlatformName } from "~/graphql/gql.gen";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useLogin } from "~/components/Auth";
import { SvgLogIn } from "~/assets/svg";
import { PLATFORM_FULLNAMES, SvgByPlatformName } from "~/lib/constants";

const PlayerPlatformChooser: React.FC<{
  active: boolean;
  resetFn: (val: any) => void;
}> = ({ active, resetFn }) => {
  const { stopPlaying } = usePlayer();

  const [, showLogin] = useLogin();

  const PlatformChoices = useMemo(
    () =>
      Object.entries(PLATFORM_FULLNAMES).map(([value, plname]) => {
        const pl = value as PlatformName;
        const SvgPlatform = SvgByPlatformName[pl];
        return (
          <button
            key={pl}
            onClick={() => {
              window.sessionStorage.setItem("playingPlatform", pl);
              resetFn({});
            }}
            className={`w-48 m-1 button rounded-full text-sm opacity-75 hover:opacity-100 transition-opacity duration-200 brand-${pl}`}
          >
            <SvgPlatform width="24" className="fill-current" strokeWidth="0" />
            <span className="ml-2 text-sm">Listen on {plname}</span>
          </button>
        );
      }),
    [resetFn]
  );

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
        {PlatformChoices}
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
