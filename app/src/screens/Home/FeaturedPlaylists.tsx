import { PlaylistItem } from "@/components/Playlist";
import { usePlaylistsFeaturedQuery } from "@/gql/gql.gen";
import { Size } from "@/styles";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  playlistItemWrapper: {
    marginRight: Size[4],
  },
});

const FeaturedPlaylists: React.FC = () => {
  const [{ data: { playlistsFeatured } = { playlistsFeatured: undefined } }] =
    usePlaylistsFeaturedQuery();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {playlistsFeatured?.map((playlist) => (
        <View key={playlist.id} style={styles.playlistItemWrapper}>
          <PlaylistItem playlist={playlist} />
        </View>
      ))}
    </ScrollView>
  );
};

export default FeaturedPlaylists;
