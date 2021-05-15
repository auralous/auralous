import { useStoryQuery, useUserQuery } from "@/gql/gql.gen";
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

  const [{ data: dataUser, stale: staleUser }] = useUserQuery({
    variables: {
      id: story?.creatorId || "",
    },
    pause: !story?.creatorId,
  });

  const creator = !staleUser ? dataUser?.user : null;

  return { story, creator } as const;
};
