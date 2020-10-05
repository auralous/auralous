import { useMutation, useQuery, useQueryCache } from "react-query";
import axios from "redaxios";
import { PlatformName } from "~/graphql/gql.gen";
import { Playlist } from "../types";
import { defaultAvatar } from "~/lib/util";
import { useCallback, useEffect } from "react";
import { useToasts } from "~/components/Toast";
import { useMAuth } from "./user";
/// <reference path="spotify-api" />

class YoutubePlaylist {
  private baseURL = "https://www.googleapis.com";
  private apiKey = process.env.GOOGLE_API_KEY;
  auth: { token: string; authId: string } | null = null;

  private async getPlaylistTracks(
    playlistId: string
  ): Promise<null | string[]> {
    if (!this.auth) return null;
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${this.auth.token}` },
      baseURL: this.baseURL,
      params: { key: this.apiKey },
    });
    const tracks: string[] = [];
    let trackJson = await instance
      .get("/youtube/v3/playlistItems", {
        params: {
          playlistId,
          part: "contentDetails",
          fields: "nextPageToken,items/contentDetails/videoId",
        },
      })
      .then((res) => res.data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      trackJson.items.forEach((trackItem: any) =>
        tracks.push(`youtube:${trackItem.contentDetails.videoId}`)
      );
      if (trackJson.nextPageToken)
        trackJson = await instance
          .get("/youtube/v3/playlistItems", {
            params: {
              playlistId,
              part: "contentDetails",
              fields: "nextPageToken,items/contentDetails/videoId",
              pageToken: trackJson.nextPageToken,
            },
          })
          .then((res) => res.data);
      else break;
    }
    return tracks;
  }

  async getAll(): Promise<null | Playlist[]> {
    if (!this.auth) return null;
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${this.auth.token}` },
      baseURL: this.baseURL,
      params: { key: this.apiKey },
    });
    const playlists: Playlist[] = [];
    let data = await instance
      .get(`/youtube/v3/playlists`, {
        params: {
          part: "id,snippet",
          mine: "true",
          fields: "nextPageToken,items(id,snippet(title,thumbnails.high.url))",
        },
      })
      .then((res) => res.data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      for (const item of data.items) {
        playlists.push({
          id: `youtube:${item.id}`,
          externalId: item.id,
          platform: PlatformName.Youtube,
          title: item.snippet.title,
          tracks: (await this.getPlaylistTracks(item.id)) || [],
          image: item.snippet.thumbnails.high.url || defaultAvatar(item.id),
        });
      }
      if (data.nextPageToken)
        data = await instance
          .get(`/youtube/v3/playlists`, {
            params: {
              part: "id,snippet",
              mine: "true",
              fields: "nextPageToken,items(id)",
              pageToken: data.nextPageToken,
            },
          })
          .then((res) => res.data);
      else break;
    }
    return playlists;
  }

  async create(name?: string): Promise<Playlist | null> {
    if (!this.auth) return null;
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${this.auth.token}` },
      baseURL: this.baseURL,
      params: { key: this.apiKey },
    });
    const data = await instance
      .post(
        `/youtube/v3/playlists`,
        { snippet: { title: name || "Untitled playlist" } },
        { params: { part: "snippet" } }
      )
      .then((res) => res.data);
    return {
      id: `youtube:${data.id}`,
      externalId: data.id,
      platform: PlatformName.Youtube,
      title: data.snippet.title,
      tracks: [],
      image: data.snippet.thumbnails?.high?.url || defaultAvatar(data.id),
    };
  }

  async addToPlaylist(
    externalId: string,
    externalTrackIds: string[]
  ): Promise<boolean> {
    if (!this.auth) return false;
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${this.auth.token}` },
      baseURL: this.baseURL,
      params: { key: this.apiKey },
    });
    for (const externalTrackId of externalTrackIds) {
      await instance.post(
        `/youtube/v3/playlistItems`,
        {
          snippet: {
            playlistId: externalId,
            resourceId: {
              kind: "youtube#video",
              videoId: externalTrackId,
            },
          },
        },
        { params: { part: "snippet" } }
      );
    }
    return true;
  }
}

class SpotifyPlaylist {
  private baseURL = "https://api.spotify.com/v1";
  auth: { token: string; authId: string } | null = null;

  private async getPlaylistTracks(
    playlistId: string
  ): Promise<null | string[]> {
    if (!this.auth) return null;
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${this.auth.token}` },
    });
    const tracks: string[] = [];
    let trackJson = await instance
      .get<SpotifyApi.PlaylistTrackResponse>(
        `${this.baseURL}/playlists/${playlistId}/tracks`
      )
      .then((res) => res.data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      trackJson.items.forEach(
        (trackItem) =>
          !trackItem.is_local && tracks.push(`spotify:${trackItem.track.id}`)
      );
      if (trackJson.next)
        trackJson = await instance
          .get<SpotifyApi.PlaylistTrackResponse>(trackJson.next)
          .then((res) => res.data);
      else break;
    }
    return tracks;
  }

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
        playlists.push({
          id: `spotify:${item.id}`,
          externalId: item.id,
          platform: PlatformName.Spotify,
          title: item.name,
          tracks: (await this.getPlaylistTracks(item.id)) || [],
          image: item.images[0]?.url || defaultAvatar(item.id),
        });
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
  const { data: mAuth } = useMAuth();

  useEffect(() => {
    playlistService.youtube.auth = null;
    playlistService.spotify.auth = null;
    if (mAuth) {
      playlistService[mAuth.platform].auth = {
        token: mAuth.accessToken,
        authId: mAuth.id,
      };
    }
  }, [mAuth]);

  return useQuery<Playlist[] | null>(
    MY_PLAYLIST_CACHEKEY,
    () => (mAuth ? playlistService[mAuth.platform].getAll() : null),
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
