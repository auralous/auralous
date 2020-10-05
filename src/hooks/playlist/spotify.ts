import axios from "redaxios";
import { defaultAvatar } from "~/lib/util";
import { PlatformName } from "~/graphql/gql.gen";
import { Playlist } from "~/types/index";
/// <reference path="spotify-api" />

export default class SpotifyPlaylist {
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
    let trackData = await instance
      .get<SpotifyApi.PlaylistTrackResponse>(
        `${this.baseURL}/playlists/${playlistId}/tracks`
      )
      .then((res) => res.data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      trackData.items.forEach(
        (trackItem) =>
          !trackItem.is_local && tracks.push(`spotify:${trackItem.track.id}`)
      );
      if (trackData.next)
        trackData = await instance
          .get<SpotifyApi.PlaylistTrackResponse>(trackData.next)
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
    let data = await instance
      .get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
        `${this.baseURL}/me/playlists`
      )
      .then((res) => res.data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      playlists.push(
        ...(await Promise.all<Playlist>(
          data.items.map(async (item) => {
            return {
              id: `spotify:${item.id}`,
              externalId: item.id,
              platform: PlatformName.Spotify,
              title: item.name,
              tracks: (await this.getPlaylistTracks(item.id)) || [],
              image: item.images[0]?.url || defaultAvatar(item.id),
            };
          })
        ))
      );
      if (data.next)
        data = await instance
          .get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(data.next)
          .then((res) => res.data);
      else break;
    }
    return playlists;
  }

  async create(name?: string): Promise<Playlist | null> {
    if (!this.auth) return null;
    const data: SpotifyApi.CreatePlaylistResponse = await axios
      .post(
        `${this.baseURL}/users/${this.auth.authId}/playlists`,
        { name: name || "Untitled playlist" },
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )
      .then((res) => res.data);
    return {
      id: `spotify:${data.id}`,
      externalId: data.id,
      platform: PlatformName.Spotify,
      title: data.name,
      tracks: [],
      image: data.images[0]?.url || defaultAvatar(data.id),
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
