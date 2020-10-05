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
