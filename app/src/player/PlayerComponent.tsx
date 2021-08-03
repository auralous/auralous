import { PlatformName } from "@auralous/api";
import { usePlaybackAuthentication } from "@auralous/player";
import { FC, useMemo } from "react";
import PlayerSpotify from "./PlayerSpotify";
import PlayerView from "./PlayerView";
import PlayerYoutube from "./PlayerYoutube";

const PlayerComponent: FC = () => {
  const { playingPlatform } = usePlaybackAuthentication();

  const DynamicPlayer = useMemo(() => {
    if (!playingPlatform) return null;
    if (playingPlatform === PlatformName.Youtube) return PlayerYoutube;
    return PlayerSpotify;
  }, [playingPlatform]);

  return (
    <>
      {DynamicPlayer && <DynamicPlayer />}
      <PlayerView />
    </>
  );
};

export default PlayerComponent;
