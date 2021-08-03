import { usePlaylistQuery, useStoryQuery } from "@auralous/api";
import {
  PlaybackContextMeta,
  PlaybackContextType,
  PlaybackCurrentContext,
} from "@auralous/player";

export const usePlaybackContextMeta = (
  playbackCurrentContext: PlaybackCurrentContext | null
): PlaybackContextMeta | null => {
  const isStory = playbackCurrentContext?.type === PlaybackContextType.Story;
  const isPlaylist =
    playbackCurrentContext?.type === PlaybackContextType.Playlist;

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
      type: PlaybackContextType.Story,
    };

  if (isPlaylist)
    return {
      id: playbackCurrentContext.id,
      contextDescription: dataPlaylist?.playlist?.name || "",
      imageUrl: dataPlaylist?.playlist?.image,
      isLive: false,
      type: PlaybackContextType.Playlist,
    };

  return null;
};
