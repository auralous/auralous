import { PlaylistItem } from "components/Playlist";
import { Spacer } from "components/Spacer";
import { PlatformName, Playlist } from "gql/gql.gen";
import React from "react";
import { ScrollView } from "react-native";

const playlistMock: Playlist = {
  __typename: "Playlist",
  externalId: "asdasdasdasdasdasda",
  id: "spotify:asdasdasdasdasdasda",
  image: "https://i.scdn.co/image/ab67706f00000002314724fc7ca36a4fce2f1b6a",
  name: "Heart Beat",
  platform: PlatformName.Spotify,
  url: "https://google.com",
};

const FeaturedPlaylists: React.FC = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <PlaylistItem playlist={playlistMock} />
      <Spacer x={4} />
      <PlaylistItem playlist={playlistMock} />
      <Spacer x={4} />
      <PlaylistItem playlist={playlistMock} />
      <Spacer x={4} />
      <PlaylistItem playlist={playlistMock} />
      <Spacer x={4} />
      <PlaylistItem playlist={playlistMock} />
    </ScrollView>
  );
};

export default FeaturedPlaylists;
