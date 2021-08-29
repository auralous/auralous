import type {
  MeQuery,
  MeQueryVariables,
  SessionCurrentLiveQuery,
  SessionCurrentLiveQueryVariables,
} from "@auralous/api";
import { MeDocument, SessionCurrentLiveDocument } from "@auralous/api";
import type { PlaybackCurrentContext } from "@auralous/player";
import player, {
  PlayerProvider as OriginalPlayerProvider,
} from "@auralous/player";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useClient } from "urql";
import { PlayerComponentInternalContext } from "./components/PlayerComponentInternalContext";
import { useTrackColor } from "./components/useTrackColor";

export const PlayerProvider: FC = ({ children }) => {
  const client = useClient();

  const [playbackCurrentContext, setPlaybackCurrentContext] =
    useState<PlaybackCurrentContext | null>(null);

  const [stopLiveIntention, setStopLiveIntention] = useState<null | {
    currentSessionId: string;
    intendedCurrentContext: PlaybackCurrentContext;
    dismiss(): void;
  }>(null);

  useEffect(() => {
    (async () => {
      // upon starting the app, check if user has current session
      // and play that
      const meResult = await client
        .query<MeQuery, MeQueryVariables>(MeDocument)
        .toPromise();
      if (!meResult?.data?.me) return;
      const result = await client
        .query<SessionCurrentLiveQuery, SessionCurrentLiveQueryVariables>(
          SessionCurrentLiveDocument,
          { creatorId: meResult.data.me.user.id }
        )
        .toPromise();
      if (result.data?.sessionCurrentLive) {
        player.playContext({
          id: result.data.sessionCurrentLive.sessionId,
          type: "session",
          shuffle: false,
        });
      }
    })();
  }, [client]);

  useEffect(() => {
    const onPlayerContext = async (
      currentContext: PlaybackCurrentContext | null
    ) => {
      if (currentContext) {
        const me = client.readQuery<MeQuery, MeQueryVariables>(MeDocument)?.data
          ?.me;
        if (me) {
          const result = await client
            .query<SessionCurrentLiveQuery, SessionCurrentLiveQueryVariables>(
              SessionCurrentLiveDocument,
              { creatorId: me.user.id }
            )
            .toPromise();

          if (result.data?.sessionCurrentLive) {
            if (
              currentContext.type !== "session" ||
              currentContext.id !== result.data.sessionCurrentLive.sessionId
            ) {
              // user has an ongoing session but attempting to play something else
              // See src/player/components/StopLiveIntention
              setStopLiveIntention({
                currentSessionId: result.data.sessionCurrentLive.sessionId,
                intendedCurrentContext: currentContext,
                dismiss: () => setStopLiveIntention(null),
              });
              return;
            }
          }
        }
      }

      setPlaybackCurrentContext(currentContext);
    };
    player.on("context", onPlayerContext);
    return () => {
      player.off("context", onPlayerContext);
    };
  }, [client]);

  return (
    <OriginalPlayerProvider
      playbackCurrentContext={playbackCurrentContext}
      client={client}
      useTrackColor={useTrackColor}
    >
      <PlayerComponentInternalContext.Provider value={{ stopLiveIntention }}>
        {children}
      </PlayerComponentInternalContext.Provider>
    </OriginalPlayerProvider>
  );
};
