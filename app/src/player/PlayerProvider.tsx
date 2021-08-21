import {
  MeDocument,
  MeQuery,
  MeQueryVariables,
  StoryCurrentLiveDocument,
  StoryCurrentLiveQuery,
  StoryCurrentLiveQueryVariables,
} from "@auralous/api";
import player, {
  PlaybackCurrentContext,
  PlayerProvider as OriginalPlayerProvider,
} from "@auralous/player";
import { FC, useEffect, useState } from "react";
import { useClient } from "urql";
import { PlayerComponentInternalContext } from "./components/PlayerComponentInternalContext";
import { useTrackColor } from "./components/useTrackColor";

export const PlayerProvider: FC = ({ children }) => {
  const client = useClient();

  const [stopLiveIntention, setStopLiveIntention] = useState<null | {
    currentStoryId: string;
    intendedCurrentContext: PlaybackCurrentContext;
    dismiss(): void;
  }>(null);

  useEffect(() => {
    (async () => {
      // upon starting the app, check if user has current story
      // and play that
      const meResult = await client
        .query<MeQuery, MeQueryVariables>(MeDocument)
        .toPromise();
      if (!meResult?.data?.me) return;
      const result = await client
        .query<StoryCurrentLiveQuery, StoryCurrentLiveQueryVariables>(
          StoryCurrentLiveDocument,
          { creatorId: meResult.data.me.user.id }
        )
        .toPromise();
      if (result.data?.storyCurrentLive) {
        player.playContext({
          id: result.data.storyCurrentLive.storyId,
          type: "story",
          shuffle: false,
        });
      }
    })();
  }, [client]);

  useEffect(() => {
    const onPlayerContext = async (currentContext: PlaybackCurrentContext) => {
      const meResult = client.readQuery<MeQuery, MeQueryVariables>(MeDocument);
      if (!meResult?.data?.me) return;
      const result = await client
        .query<StoryCurrentLiveQuery, StoryCurrentLiveQueryVariables>(
          StoryCurrentLiveDocument,
          { creatorId: meResult.data.me.user.id }
        )
        .toPromise();

      if (result.data?.storyCurrentLive) {
        if (
          currentContext.type !== "story" ||
          currentContext.id !== result.data.storyCurrentLive.storyId
        ) {
          // user has an ongoing story but attempting to play something else
          // See src/player/components/StopLiveIntention
          setStopLiveIntention({
            currentStoryId: result.data.storyCurrentLive.storyId,
            intendedCurrentContext: currentContext,
            dismiss: () => setStopLiveIntention(null),
          });
          return;
        }
      }

      player.setPlaybackCurrentContext(currentContext);
    };
    player.on("context", onPlayerContext);
    return () => {
      player.off("context", onPlayerContext);
    };
  }, [client]);

  return (
    <OriginalPlayerProvider client={client} useTrackColor={useTrackColor}>
      <PlayerComponentInternalContext.Provider value={{ stopLiveIntention }}>
        {children}
      </PlayerComponentInternalContext.Provider>
    </OriginalPlayerProvider>
  );
};
