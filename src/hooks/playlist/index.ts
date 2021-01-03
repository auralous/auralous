import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PlaylistSpotify from "./PlaylistSpotify";
import PlaylistYoutube from "./PlaylistYouTube";
import { Playlist } from "~/types/index";
import { useMAuth } from "~/hooks/user";
import { PlatformName } from "~/graphql/gql.gen";

const playlistService = {
  [PlatformName.Youtube]: new PlaylistYoutube(),
  [PlatformName.Spotify]: new PlaylistSpotify(),
};

const CACHE_PREFIX = "my-playlists";

export const useMyPlaylistsQuery = (options?: { disabled: boolean }) => {
  const { data: mAuth } = useMAuth();
  const cacheKey = CACHE_PREFIX + mAuth?.id;

  return useQuery<Playlist[] | null>(
    cacheKey,
    () => {
      for (const plPlatform of Object.keys(playlistService)) {
        playlistService[plPlatform as PlatformName].auth = null;
      }
      if (mAuth) {
        playlistService[mAuth.platform].auth = {
          token: mAuth.accessToken,
          authId: mAuth.id,
        };
      }
      return mAuth ? playlistService[mAuth.platform].getAll() : null;
    },
    {
      enabled: !!mAuth && !options?.disabled,
      refetchOnMount: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};

export const useInsertPlaylistTracksMutation = () => {
  const { data: mAuth } = useMAuth();
  const cacheKey = CACHE_PREFIX + mAuth?.id;
  const queryClient = useQueryClient();
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
            name || "Untitled Playlist"
          );
          if (createdPlaylist)
            queryClient.setQueryData<Playlist[] | null>(
              cacheKey,
              (playlists) => [...(playlists || []), createdPlaylist]
            );
          id = createdPlaylist?.id;
        } catch (e) {
          return false;
        }
      }
      if (!id) return false;
      const ok = await playlistService[mAuth.platform].addToPlaylist(
        id.split(":")[1],
        tracks.map((trackId) => trackId.split(":")[1])
      );
      if (ok) {
        queryClient.setQueryData<Playlist[] | null>(cacheKey, (playlists) => {
          const playlist = (playlists || []).find((pl) => pl.id === id);
          playlist?.tracks.push(...tracks);
          return playlists || null;
        });
      }
      return ok;
    },
    [mAuth, queryClient, cacheKey]
  );

  return useMutation(insertPlaylistTracks);
};
