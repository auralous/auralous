import { usePlaylistQuery, useSessionQuery } from "@auralous/api";
import type { PlaybackContextMeta, PlaybackCurrentContext } from "../types";

export const usePlaybackContextMeta = (
  playbackCurrentContext: PlaybackCurrentContext | null
): PlaybackContextMeta | null => {
  const isSession = playbackCurrentContext?.type === "session";
  const isPlaylist = playbackCurrentContext?.type === "playlist";

  const [{ data: dataSession }] = useSessionQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: !isSession,
  });
  const [{ data: dataPlaylist }] = usePlaylistQuery({
    variables: { id: playbackCurrentContext?.id || "" },
    pause: !isPlaylist,
  });

  if (!playbackCurrentContext) return null;

  if (isSession)
    return {
      id: playbackCurrentContext.id,
      contextDescription: dataSession?.session?.text || "",
      contextCollaborators: dataSession?.session?.collaboratorIds,
      contextOwner: dataSession?.session?.creatorId,
      imageUrl: dataSession?.session?.image,
      isLive: dataSession?.session?.isLive || false,
      type: "session",
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
