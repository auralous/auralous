import { usePlaylistQuery, useSessionQuery } from "@auralous/api";
import type { PlaybackContextMeta, PlaybackCurrentContext } from "../types";

export const usePlaybackContextMeta = (
  playbackCurrentContext: PlaybackCurrentContext | null
): PlaybackContextMeta | null => {
  const isSession = playbackCurrentContext?.id?.[0] === "session";
  const isPlaylist = playbackCurrentContext?.id?.[0] === "playlist";
  const entityId = playbackCurrentContext?.id?.[1];

  const [{ data: dataSession }] = useSessionQuery({
    variables: { id: entityId || "" },
    pause: !isSession,
  });
  const [{ data: dataPlaylist }] = usePlaylistQuery({
    variables: { id: entityId || "" },
    pause: !isPlaylist,
  });

  if (!playbackCurrentContext) return null;

  if (isSession)
    return {
      id: entityId!,
      contextDescription: dataSession?.session?.text || "",
      contextCollaborators: dataSession?.session?.collaboratorIds,
      contextOwner: dataSession?.session?.creatorId,
      imageUrl: dataSession?.session?.image,
      isLive: dataSession?.session?.isLive || false,
      type: "session",
    };

  if (isPlaylist)
    return {
      id: entityId!,
      contextDescription: dataPlaylist?.playlist?.name || "",
      imageUrl: dataPlaylist?.playlist?.image,
      isLive: false,
      type: "playlist",
    };

  return null;
};
