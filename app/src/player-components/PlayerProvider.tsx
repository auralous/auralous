import type { PlaybackCurrentContext } from "@/player";
import player, { PlayerProvider as OriginalPlayerProvider } from "@/player";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useUiDispatch } from "@/ui-context";
import {
  useClient,
  useMeQuery,
  useSessionCurrentLiveQuery,
} from "@auralous/api";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useTrackColor } from "./PlayerView/useTrackColor";

export const PlayerProvider: FC<{
  navigationRef: NavigationContainerRefWithCurrent<ParamList>;
}> = ({ children, navigationRef }) => {
  const client = useClient();

  const [playbackCurrentContext, setPlaybackCurrentContext] =
    useState<PlaybackCurrentContext | null>(null);

  const uiDispatch = useUiDispatch();

  const [{ data: dataSessionCurrentLive }, refetchSessionCurrentLive] =
    useSessionCurrentLiveQuery({
      variables: { mine: true },
    });
  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(refetchSessionCurrentLive, [
    me?.user.id,
    refetchSessionCurrentLive,
  ]);

  const initialLiveCheck = useRef(false);
  useEffect(() => {
    if (dataSessionCurrentLive?.sessionCurrentLive === undefined) return;
    if (initialLiveCheck.current === true) return;
    initialLiveCheck.current = true;
    const sessionId = dataSessionCurrentLive?.sessionCurrentLive?.sessionId;
    if (!sessionId) return undefined;
    setPlaybackCurrentContext({
      id: sessionId,
      type: "session",
      shuffle: false,
    });
    navigationRef.current?.navigate(RouteName.Session, { id: sessionId });
  }, [dataSessionCurrentLive?.sessionCurrentLive, navigationRef]);

  useEffect(() => {
    const onPlayerContext = async (
      currentContext: PlaybackCurrentContext | null
    ) => {
      if (currentContext) {
        if (
          dataSessionCurrentLive?.sessionCurrentLive &&
          (currentContext.type !== "session" ||
            currentContext.id !==
              dataSessionCurrentLive.sessionCurrentLive.sessionId)
        ) {
          return uiDispatch({
            type: "stopLiveOnPlay",
            value: {
              visible: true,
              intention: {
                sessionId: dataSessionCurrentLive.sessionCurrentLive.sessionId,
                nextPlaybackContext: currentContext,
              },
            },
          });
        }
      }
      setPlaybackCurrentContext(currentContext);
    };
    player.on("context", onPlayerContext);
    return () => {
      player.off("context", onPlayerContext);
    };
  }, [client, uiDispatch, dataSessionCurrentLive]);

  return (
    <OriginalPlayerProvider
      playbackCurrentContext={playbackCurrentContext}
      useTrackColor={useTrackColor}
    >
      {children}
    </OriginalPlayerProvider>
  );
};
