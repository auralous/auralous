export const FRAGMENT_PLAYLIST_DETAIL = /* GraphQL */ `
  fragment PlaylistDetailParts on Playlist {
    title
    image
    platform
    externalId
  }
`;

export const QUERY_MY_PLAYLISTS = /* GraphQL */ `
  query myPlaylists {
    myPlaylists {
      id
      ...PlaylistDetailParts
      tracks
    }
  }
  ${FRAGMENT_PLAYLIST_DETAIL}
`;

export const MUTATION_CREATE_PLAYLIST = /* GraphQL */ `
  mutation createPlaylist(
    $title: String!
    $platform: PlatformName!
    $tracks: [String!]
  ) {
    createPlaylist(title: $title, platform: $platform, tracks: $tracks) {
      id
      ...PlaylistDetailParts
      tracks
    }
  }
  ${FRAGMENT_PLAYLIST_DETAIL}
`;

export const MUTATION_INSERT_PLAYLIST_TRACKS = /* GraphQL */ `
  mutation insertPlaylistTracks($id: ID!, $tracks: [String!]!) {
    insertPlaylistTracks(id: $id, tracks: $tracks) {
      id
      ...PlaylistDetailParts
      tracks
    }
  }
  ${FRAGMENT_PLAYLIST_DETAIL}
`;
