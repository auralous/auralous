import { useStoryQuery } from "@/gql/gql.gen";
import { PlaybackContextType, PlaybackCurrentContext } from "./Context";

export const usePlaybackContextData = (
  playbackCurrentContext: PlaybackCurrentContext | null
) => {
  const [{ data: dataStory, stale: staleStory }] = useStoryQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: playbackCurrentContext?.type !== PlaybackContextType.Story,
  });

  if (!playbackCurrentContext) return null;

  const story = !staleStory ? dataStory?.story : null;

  return story;
};
