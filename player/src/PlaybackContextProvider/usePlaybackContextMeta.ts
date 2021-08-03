import { usePlaylistQuery, useStoryQuery } from "@auralous/api";
import { PlaybackContextMeta, PlaybackCurrentContext } from "../types";

export const usePlaybackContextMeta = (
  playbackCurrentContext: PlaybackCurrentContext | null
): PlaybackContextMeta | null => {
  const isStory = playbackCurrentContext?.type === "story";
  const isPlaylist = playbackCurrentContext?.type === "playlist";

  const [{ data: dataStory }] = useStoryQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: !isStory,
  });
  const [{ data: dataPlaylist }] = usePlaylistQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: !isPlaylist,
  });

  if (!playbackCurrentContext) return null;

  if (isStory)
    return {
      id: playbackCurrentContext.id,
      contextDescription: dataStory?.story?.text || "",
      contextCollaborators: dataStory?.story?.collaboratorIds,
      contextOwner: dataStory?.story?.creatorId,
      imageUrl: dataStory?.story?.image,
      isLive: dataStory?.story?.isLive || false,
      type: "story",
    };

  if (isPlaylist)
    return {
      id: playbackCurrentContext.id,
      contextDescription: dataPlaylist?.playlist?.name || "",
      imageUrl: dataPlaylist?.playlist?.image,
      isLive: false,
      type: "playlist",
    };

  return null;
};
