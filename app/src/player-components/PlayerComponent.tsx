import { usePlaybackAuthentication } from "@/player";
import { PlatformName } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import PlayerSpotify from "./PlayerSpotify";
import PlayerYoutube from "./PlayerYoutube";

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
    </>
  );
};

export default PlayerComponent;
