import {
  Playlist,
  Story,
  usePlaylistQuery,
  useStoryQuery,
} from "@auralous/api";
import { PlaybackContextType, PlaybackCurrentContext } from "@auralous/player";

export const usePlaybackContextData = (
  playbackCurrentContext: PlaybackCurrentContext | null
):
  | null
  | {
      data: Story | null;
      type: PlaybackContextType.Story;
    }
  | {
      data: Playlist | null;
      type: PlaybackContextType.Playlist;
    } => {
  const [{ data: dataStory }] = useStoryQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: playbackCurrentContext?.type !== PlaybackContextType.Story,
  });
  const [{ data: dataPlaylist }] = usePlaylistQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: playbackCurrentContext?.type !== PlaybackContextType.Playlist,
  });

  if (!playbackCurrentContext) return null;

  if (playbackCurrentContext?.type === PlaybackContextType.Story)
    return {
      data: dataStory?.story || null,
      type: PlaybackContextType.Story,
    };
  if (playbackCurrentContext?.type === PlaybackContextType.Playlist)
    return {
      data: dataPlaylist?.playlist || null,
      type: PlaybackContextType.Playlist,
    };
  return null;
};
