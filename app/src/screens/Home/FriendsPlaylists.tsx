import { usePlaylistsFriendsQuery } from "@auralous/api";
import { PlaylistItem, Size } from "@auralous/ui";
import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  playlistItemWrapper: {
    marginRight: Size[4],
  },
});

const FriendsPlaylists: FC = () => {
  const [{ data: { playlistsFriends } = { playlistsFriends: undefined } }] =
    usePlaylistsFriendsQuery();

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
