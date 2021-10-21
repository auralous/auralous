import { usePlaybackAuthentication, usePlaybackTrackId } from "@/player";
import { PlatformName } from "@auralous/api";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import PlayerSpotify from "./PlayerSpotify";
import PlayerYoutube from "./PlayerYoutube";

const PlayerComponent: FC = ({ children }) => {
  const { playingPlatform } = usePlaybackAuthentication();
  const [loaded, setLoaded] = useState(false);

  const trackId = usePlaybackTrackId();
  useEffect(() => {
    if (trackId) setLoaded(true);
  }, [trackId]);

  const DynamicPlayer = useMemo(() => {
    if (!loaded || !playingPlatform) return null;
    if (playingPlatform === PlatformName.Youtube) return PlayerYoutube;
    return PlayerSpotify;
  }, [playingPlatform, loaded]);

  return (
    <>
      {DynamicPlayer && <DynamicPlayer />}
      {children}
    </>
  );
};

export default PlayerComponent;
