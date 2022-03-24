import {
  usePlaybackStateAuthContext,
  usePlaybackStateSourceContext,
} from "@/player/Context";
import { PlatformName } from "@auralous/api";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import PlayerSpotify from "./PlayerSpotify";
import PlayerYoutube from "./PlayerYoutube";

const PlayerComponent: FC = () => {
  const { playingPlatform, accessToken } = usePlaybackStateAuthContext();
  const [loaded, setLoaded] = useState(false);

  const trackId = usePlaybackStateSourceContext().trackId;
  useEffect(() => {
    if (trackId) setLoaded(true);
  }, [trackId]);

  const DynamicPlayer = useMemo(() => {
    if (!loaded || !playingPlatform) return null;
    if (playingPlatform === PlatformName.Youtube) return PlayerYoutube;
    return PlayerSpotify;
  }, [playingPlatform, loaded]);

  return DynamicPlayer ? <DynamicPlayer accessToken={accessToken} /> : null;
};

export default PlayerComponent;
