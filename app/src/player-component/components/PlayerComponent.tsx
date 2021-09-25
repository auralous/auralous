import { usePlaybackAuthentication } from "@/player";
import { PlatformName } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import PlayerSpotify from "../PlayerSpotify";
import PlayerYoutube from "../PlayerYoutube";
import PlayerView from "./PlayerView";

const PlayerComponent: FC = ({ children }) => {
  const { playingPlatform } = usePlaybackAuthentication();

  const DynamicPlayer = useMemo(() => {
    if (!playingPlatform) return null;
    if (playingPlatform === PlatformName.Youtube) return PlayerYoutube;
    return PlayerSpotify;
  }, [playingPlatform]);

  return (
    <>
      {DynamicPlayer && <DynamicPlayer />}
      {children}
      <PlayerView />
    </>
  );
};

export default PlayerComponent;
