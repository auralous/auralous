import { PlatformName } from "gql/gql.gen";

const platformUtil: Record<
  PlatformName,
  {
    getTrackIdFromUri(uri: string): string | null;
    getPlaylistIdFromUri(uri: string): string | null;
  }
> = {
  youtube: {
    getTrackIdFromUri(uri: string): string | null {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = uri.match(regExp);
      return match?.[7]?.length === 11 ? match[7] : null;
    },
    getPlaylistIdFromUri(uri: string): string | null {
      if (!uri.includes("youtube")) return null;
      const regExp = /^.*((v\/)|(\/u\/\w\/)|(\/playlist\?)|(watch\?))?list?=?([^#&?]*).*/;
      const match = uri.match(regExp);
      return match?.[6] || null;
    },
  },
  spotify: {
    getTrackIdFromUri(uri: string): string | null {
      const regExp = /^https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/;
      const match = uri.match(regExp);
      if (!match) return null;
      return match?.[1] || null;
    },
    getPlaylistIdFromUri(uri: string): string | null {
      const regExp = /^https:\/\/open.spotify.com\/playlist\/([a-zA-Z0-9]+)/;
      const match = uri.match(regExp);
      if (!match) return null;
      return match?.[1] || null;
    },
  },
};

export const maybeGetTrackOrPlaylistIdFromUri = (
  maybeUri: string
): { type: "track" | "playlist"; id: string } | undefined => {
  for (const platform of Object.keys(platformUtil) as PlatformName[]) {
    let result: string | null = null;
    if ((result = platformUtil[platform].getPlaylistIdFromUri(maybeUri)))
      return { type: "playlist", id: `${platform}:${result}` };
    else if ((result = platformUtil[platform].getTrackIdFromUri(maybeUri)))
      return { type: "track", id: `${platform}:${result}` };
  }
  return undefined;
};
