export const FRAGMENT_ARTIST_DETAIL = /* GraphQL */ `
  fragment ArtistParts on Artist {
    id
    platform
    externalId
    name
    image
    url
  }
`;

export const FRAGMENT_TRACK = /* GraphQL */ `
  fragment TrackParts on Track {
    id
    platform
    externalId
    title
    duration
    image
    url
    artists {
      ...ArtistParts
    }
  }
  ${FRAGMENT_ARTIST_DETAIL}
`;

export const QUERY_TRACK = /* GraphQL */ `
  query track($uri: String, $id: ID) {
    track(uri: $uri, id: $id) {
      ...TrackParts
    }
  }
  ${FRAGMENT_TRACK}
`;

export const QUERY_CROSS_TRACKS = /* GraphQL */ `
  query crossTracks($id: ID!) {
    crossTracks(id: $id) {
      id
      youtube
      spotify
    }
  }
`;

export const QUERY_SEARCH_TRACK = /* GraphQL */ `
  query searchTrack($platform: PlatformName!, $query: String!) {
    searchTrack(platform: $platform, query: $query) {
      ...TrackParts
    }
  }
  ${FRAGMENT_TRACK}
`;
