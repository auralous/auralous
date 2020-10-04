import { useMutation, useQuery, useQueryCache } from "react-query";
import axios from "redaxios";
import { PlatformName, useMeAuthQuery } from "~/graphql/gql.gen";
import { Playlist } from "../types";
import { defaultAvatar } from "~/lib/util";
import { useCallback, useEffect } from "react";
import { useToasts } from "~/components/Toast";
/// <reference path="spotify-api" />

class YoutubePlaylist {
  auth: { token: string; authId: string } | null = null;

  async getAll(): Promise<null | Playlist[]> {
    return null;
  }

  async create(name?: string): Promise<Playlist | null> {
    return null;
  }

  async addToPlaylist(
    externalId: string,
    externalTrackIds: string[]
  ): Promise<boolean> {
    return false;
  }
}

class SpotifyPlaylist {
  private baseURL = "https://api.spotify.com/v1";
  auth: { token: string; authId: string } | null = null;

  async getAll(): Promise<null | Playlist[]> {
    if (!this.auth) return null;
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${this.auth.token}` },
    });
    const playlists: Playlist[] = [];
    let json = await instance
      .get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
        `${this.baseURL}/me/playlists`
      )
      .then((res) => res.data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      for (const item of json.items) {
        const playlist: Playlist = {
          id: `spotify:${item.id}`,
          externalId: item.id,
          platform: PlatformName.Spotify,
          title: item.name,
          tracks: [],
          image: item.images[0]?.url || defaultAvatar(item.id),
        };
        let trackJson = await instance
          .get<SpotifyApi.PlaylistTrackResponse>(item.tracks.href)
          .then((res) => res.data);
        // eslint-disable-next-line no-constant-condition
        while (true) {
          trackJson.items.forEach(
            (trackItem) =>
              !trackItem.is_local &&
              playlist.tracks.push(`spotify:${trackItem.track.id}`)
          );
          if (trackJson.next)
            trackJson = await instance
              .get<SpotifyApi.PlaylistTrackResponse>(trackJson.next)
              .then((res) => res.data);
          else break;
        }
        playlists.push(playlist);
      }
      if (json.next)
        json = await instance
          .get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(json.next)
          .then((res) => res.data);
      else break;
    }
    return playlists;
  }

  async create(name?: string): Promise<Playlist | null> {
    if (!this.auth) return null;
    const json: SpotifyApi.CreatePlaylistResponse = await axios
      .post(
        `${this.baseURL}/users/${this.auth.authId}/playlists`,
        { name: name || "Untitled playlist" },
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )
      .then((res) => res.data);
    return {
      id: `spotify:${json.id}`,
      externalId: json.id,
      platform: PlatformName.Spotify,
      title: json.name,
      tracks: [],
      image: json.images[0]?.url || defaultAvatar(json.id),
    };
  }

  async addToPlaylist(
    externalId: string,
    externalTrackIds: string[]
  ): Promise<boolean> {
    if (!this.auth) return false;
    return axios
      .post(
        `${this.baseURL}/playlists/${externalId}/tracks`,
        {
          uris: externalTrackIds.map(
            (externalTrackId) => `spotify:track:${externalTrackId}`
          ),
        },
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )
      .then((res) => res.data && true);
  }
}

const playlistService = {
  youtube: new YoutubePlaylist(),
  spotify: new SpotifyPlaylist(),
};

const MY_PLAYLIST_CACHEKEY = "my-playlists";

export const useMyPlaylistsQuery = () => {
  const [{ data: dataMeAuth }] = useMeAuthQuery();
  const [{ data: { meAuth } = { meAuth: undefined } }] = useMeAuthQuery();

  useEffect(() => {
    playlistService.youtube.auth = null;
    playlistService.spotify.auth = null;
    if (meAuth?.playingPlatform) {
      const authProvider = meAuth[meAuth.playingPlatform];
      playlistService[meAuth.playingPlatform].auth = {
        token: authProvider.token!,
        authId: authProvider.authId!,
      };
    }
  }, [meAuth]);

  return useQuery<Playlist[] | null>(
    MY_PLAYLIST_CACHEKEY,
    () => {
      if (!dataMeAuth?.meAuth?.playingPlatform) return null;
      return playlistService[dataMeAuth.meAuth.playingPlatform].getAll();
    },
    {
      enabled: !!dataMeAuth?.meAuth?.playingPlatform,
      refetchOnMount: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useInsertPlaylistTracksMutation = () => {
  const [{ data: { meAuth } = { meAuth: undefined } }] = useMeAuthQuery();

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
      if (!meAuth?.playingPlatform) return false;
      if (!id) {
        // If no id is provided, create new playlist
        try {
          const createdPlaylist = await playlistService[
            meAuth.playingPlatform
          ].create(name);
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
      const ok = await playlistService[meAuth.playingPlatform].addToPlaylist(
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
    [meAuth, toasts, queryCache]
  );

  return useMutation(insertPlaylistTracks);
};
