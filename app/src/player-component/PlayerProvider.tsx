import { useUiDispatch } from "@/context";
import type { PlaybackCurrentContext } from "@/player";
import player, { PlayerProvider as OriginalPlayerProvider } from "@/player";
import {
  useClient,
  useMeQuery,
  useSessionCurrentLiveQuery,
} from "@auralous/api";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTrackColor } from "./components/useTrackColor";

export const PlayerProvider: FC = ({ children }) => {
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

  useEffect(() => {
    const sessionId = dataSessionCurrentLive?.sessionCurrentLive?.sessionId;
    if (!sessionId) return undefined;
    setPlaybackCurrentContext({
      id: sessionId,
      type: "session",
      shuffle: false,
    });
  }, [dataSessionCurrentLive?.sessionCurrentLive?.sessionId]);

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
