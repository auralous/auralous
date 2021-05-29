import { PlaylistItem } from "@/components/Playlist";
import { usePlaylistsFriendsQuery } from "@/gql/gql.gen";
import { Size } from "@/styles";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  playlistItemWrapper: {
    marginRight: Size[4],
  },
});

const FriendsPlaylists: React.FC = () => {
  const [
    { data: { playlistsFriends } = { playlistsFriends: undefined } },
  ] = usePlaylistsFriendsQuery();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {playlistsFriends?.map((playlist) => (
        <View key={playlist.id} style={styles.playlistItemWrapper}>
          <PlaylistItem playlist={playlist} />
        </View>
      ))}
    </ScrollView>
  );
};

export default FriendsPlaylists;
