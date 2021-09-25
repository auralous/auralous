import { PlatformName } from "@auralous/api";
import { usePlaybackAuthentication } from "@auralous/player";
import { PlayerBar, useDialog } from "@auralous/ui";
import type { FC } from "react";
import { useMemo } from "react";
import { useLocation } from "react-router";
import PlayerSpotify from "./PlayerSpotify";
import PlayerView from "./PlayerView";
import PlayerYoutube from "./PlayerYoutube";

const hiddenRoutes = [
  "/new/select-songs",
  "/new/quick-share",
  "/map",
] as string[];

const PlayerBarWrapper: FC<{ onPress(): void }> = ({ onPress }) => {
  const location = useLocation();
  if (hiddenRoutes.includes(location.pathname)) return null;
  return <PlayerBar onPress={onPress} />;
};

const PlayerViewAndBar: FC = () => {
  const [visible, present, dismiss] = useDialog();
  return (
    <>
      <PlayerView visible={visible} onDismiss={dismiss} />
      <PlayerBarWrapper onPress={present} />
    </>
  );
};

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
      <PlayerViewAndBar />
    </>
  );
};

export default PlayerComponent;
