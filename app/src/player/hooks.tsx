import type {
  PlaylistQuery,
  PlaylistQueryVariables,
  SessionQuery,
  SessionQueryVariables,
} from "@auralous/api";
import { PlaylistDocument, SessionDocument, useQuery } from "@auralous/api";
import { usePlaybackSelectionContext } from "./Context";
import type { PlaybackCurrentMeta } from "./types";

export function useCurrentPlaybackMeta(): PlaybackCurrentMeta | null {
  const playbackSelection = usePlaybackSelectionContext();
  const isSession = playbackSelection?.id?.[0] === "session";
  const isPlaylist = playbackSelection?.id?.[0] === "playlist";
  const entityId = playbackSelection?.id?.[1];

  const [{ data }] = useQuery<
    SessionQuery | PlaylistQuery,
    SessionQueryVariables | PlaylistQueryVariables
  >({
    query: isSession ? SessionDocument : PlaylistDocument,
    variables: {
      id: entityId as string,
    },
    pause: !isSession && !isPlaylist,
  });

  if (!data || (!isSession && !isPlaylist)) return null;
  if ("session" in data && data.session) {
    return {
      id: data.session.id,
      contextDescription: data.session.text || "",
      contextCollaborators: data.session.collaboratorIds,
      contextOwner: data.session.creatorId,
      imageUrl: data.session.image,
      isLive: data.session.isLive || false,
      type: "session",
    };
  } else if ("playlist" in data && data.playlist) {
    return {
      id: data.playlist.id,
      contextDescription: data.playlist.name || "",
      imageUrl: data.playlist.image,
      isLive: false,
      type: "playlist",
    };
  }
  return null;
}

export function useIsCurrentPlaybackSelection(
  type: PlaybackCurrentMeta["type"],
  entityId: string
) {
  const playbackSelection = usePlaybackSelectionContext();
  return (
    !!playbackSelection?.id &&
    playbackSelection.id[0] === type &&
    playbackSelection.id[1] === entityId
  );
}
