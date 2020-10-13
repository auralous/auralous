import { useCallback } from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import SpotifyPlaylist from "./spotify";
import YoutubePlaylist from "./youtube";
import { Playlist } from "~/types/index";
import { useToasts } from "~/components/Toast";
import { useMAuth } from "~/hooks/user";

const playlistService = {
  youtube: new YoutubePlaylist(),
  spotify: new SpotifyPlaylist(),
};

const MY_PLAYLIST_CACHEKEY = "my-playlists";

export const useMyPlaylistsQuery = () => {
  const { data: mAuth } = useMAuth();

  return useQuery<Playlist[] | null>(
    MY_PLAYLIST_CACHEKEY + mAuth?.id,
    () => {
      playlistService.youtube.auth = null;
      playlistService.spotify.auth = null;
      if (mAuth) {
        playlistService[mAuth.platform].auth = {
          token: mAuth.accessToken,
          authId: mAuth.id,
        };
      }
      return mAuth ? playlistService[mAuth.platform].getAll() : null;
    },
    {
      enabled: !!mAuth,
      refetchOnMount: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useInsertPlaylistTracksMutation = () => {
  const { data: mAuth } = useMAuth();
  const toasts = useToasts();
  const queryCache = useQueryCache();
  const insertPlaylistTracks = useCallback(
    async ({
      id,
      name,
      tracks,
    }: {
      id?: string;
      name?: string;
      tracks: string[];
    }): Promise<boolean> => {
      if (!mAuth) return false;
      if (!id) {
        // If no id is provided, create new playlist
        try {
          const createdPlaylist = await playlistService[mAuth.platform].create(
            name
          );
          if (createdPlaylist)
            queryCache.setQueryData<Playlist[] | null>(
              MY_PLAYLIST_CACHEKEY,
              (playlists) => [...(playlists || []), createdPlaylist]
            );
        } catch (e) {
          /* noop */
        }
      }
      if (!id) {
        toasts.error("Could not add to playlist");
        return false;
      }
      const ok = await playlistService[mAuth.platform].addToPlaylist(
        id.split(":")[1],
        tracks.map((trackId) => trackId.split(":")[1])
      );
      if (ok) {
        queryCache.setQueryData<Playlist[] | null>(
          MY_PLAYLIST_CACHEKEY,
          (playlists) => {
            const playlist = (playlists || []).find((pl) => pl.id === id);
            playlist?.tracks.push(...tracks);
            return playlists || null;
          }
        );
      }
      return ok;
    },
    [mAuth, toasts, queryCache]
  );

  return useMutation(insertPlaylistTracks);
};
