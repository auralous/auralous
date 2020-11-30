import axios from "redaxios";
import { defaultAvatar } from "~/lib/util";
import { PlatformName } from "~/graphql/gql.gen";
import { Playlist } from "~/types/index";

export default class PlaylistYoutube {
  private baseURL = "https://www.googleapis.com";
  private apiKey = process.env.GOOGLE_API_KEY;
  private _auth: { token: string; authId: string } | null = null;
  private instance: typeof axios | null = null;
  get auth() {
    return this._auth;
  }
  set auth(val) {
    this.instance = val
      ? axios.create({
          headers: { Authorization: `Bearer ${val.token}` },
          baseURL: this.baseURL,
          params: { key: this.apiKey },
        })
      : null;
    this._auth = val;
  }
  private async getPlaylistTracks(
    playlistId: string
  ): Promise<null | string[]> {
    if (!this.instance) return null;
    const tracks: string[] = [];
    let trackData = await this.instance
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
      trackData.items.forEach((trackItem: any) =>
        tracks.push(`youtube:${trackItem.contentDetails.videoId}`)
      );
      if (trackData.nextPageToken)
        trackData = await this.instance
          .get("/youtube/v3/playlistItems", {
            params: {
              playlistId,
              part: "contentDetails",
              fields: "nextPageToken,items/contentDetails/videoId",
              pageToken: trackData.nextPageToken,
            },
          })
          .then((res) => res.data);
      else break;
    }
    return tracks;
  }

  async getAll(): Promise<null | Playlist[]> {
    if (!this.instance) return null;
    const playlists: Playlist[] = [];
    let data = await this.instance
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
      playlists.push(
        ...(await Promise.all<Playlist>(
          data.items.map(async (item: any) => {
            return {
              id: `youtube:${item.id}`,
              externalId: item.id,
              platform: PlatformName.Youtube,
              title: item.snippet.title,
              tracks: (await this.getPlaylistTracks(item.id)) || [],
              image: item.snippet.thumbnails.high.url || defaultAvatar(item.id),
            };
          })
        ))
      );

      if (data.nextPageToken)
        data = await this.instance
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

  async create(name: string): Promise<Playlist | null> {
    if (!this.instance) return null;
    const data = await this.instance
      .post(
        `/youtube/v3/playlists`,
        { snippet: { title: name } },
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
      url: `https://www.youtube.com/playlist?list=${data.id}`,
    };
  }

  async addToPlaylist(
    externalId: string,
    externalTrackIds: string[]
  ): Promise<boolean> {
    if (!this.instance) return false;
    for (const externalTrackId of externalTrackIds) {
      await this.instance.post(
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
