import type {
  PlaylistQuery,
  PlaylistQueryVariables,
  SessionQuery,
  SessionQueryVariables,
} from "@auralous/api";
import { PlaylistDocument, SessionDocument, useQuery } from "@auralous/api";
import { usePlaybackCurrentContext } from "./Context";
import type { PlaybackContextMeta } from "./types";

export function useCurrentContextMeta(): PlaybackContextMeta | null {
  const currentContext = usePlaybackCurrentContext();
  const isSession = currentContext?.id?.[0] === "session";
  const isPlaylist = currentContext?.id?.[0] === "playlist";
  const entityId = currentContext?.id?.[1];

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

export function useIsCurrentPlaybackContext(
  type: PlaybackContextMeta["type"],
  entityId: string
) {
  const currentContext = usePlaybackCurrentContext();
  return (
    !!currentContext?.id &&
    currentContext.id[0] === type &&
    currentContext.id[1] === entityId
  );
}
