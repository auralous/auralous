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

export const FRAGMENT_PLAYLIST = /* GraphQL */ `
  fragment PlaylistParts on Playlist {
    id
    platform
    externalId
    name
    image
    url
  }
`;

export const QUERY_TRACK = /* GraphQL */ `
  query track($id: ID!) {
    track(id: $id) {
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
  query searchTrack($query: String!) {
    searchTrack(query: $query) {
      ...TrackParts
    }
  }
  ${FRAGMENT_TRACK}
`;

export const QUERY_PLAYLIST = /* GraphQL */ `
  query playlist($id: ID!) {
    playlist(id: $id) {
      ...PlaylistParts
    }
  }
  ${FRAGMENT_PLAYLIST}
`;

export const QUERY_MY_PLAYLISTS = /* GraphQL */ `
  query myPlaylists {
    myPlaylists {
      ...PlaylistParts
    }
  }
  ${FRAGMENT_PLAYLIST}
`;

export const QUERY_PLAYLIST_TRACKS = /* GraphQL */ `
  query playlistTracks($id: ID!) {
    playlistTracks(id: $id) {
      ...TrackParts
    }
  }
  ${FRAGMENT_TRACK}
`;

export const MUTATION_PLAYLIST_ADD_TRACKS = /* GraphQL */ `
  mutation playlistAddTracks($id: ID!, $trackIds: [String!]!) {
    playlistAddTracks(id: $id, trackIds: $trackIds)
  }
`;

export const MUTATION_PLAYLIST_CREATE = /* GraphQL */ `
  mutation playlistCreate($name: String!, $trackIds: [String!]!) {
    playlistCreate(name: $name, trackIds: $trackIds) {
      ...PlaylistParts
    }
  }
  ${FRAGMENT_PLAYLIST}
`;
