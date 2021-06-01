import { useStoryQuery } from "@/gql/gql.gen";
import { PlaybackContextType } from "./Context";

export const usePlaybackContextData = (
  contextType: PlaybackContextType | null,
  contextId: string | null
) => {
  const [{ data: dataStory, stale: staleStory }] = useStoryQuery({
    variables: { id: contextId || "" },
    pause: !contextId || contextType !== PlaybackContextType.Story,
  });

  const story = !staleStory ? dataStory?.story : null;
  const creator = story?.creator;
  return { story, creator } as const;
};
