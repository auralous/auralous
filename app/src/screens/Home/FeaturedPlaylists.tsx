import { usePlaylistsFeaturedQuery } from "@auralous/api";
import { PlaylistItem, Size } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RouteName } from "../types";

const styles = StyleSheet.create({
  playlistItemWrapper: {
    marginRight: Size[4],
  },
});

const FeaturedPlaylists: React.FC = () => {
  const [{ data: { playlistsFeatured } = { playlistsFeatured: undefined } }] =
    usePlaylistsFeaturedQuery();

  const { navigate } = useNavigation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {playlistsFeatured?.map((playlist) => (
        <TouchableOpacity
          key={playlist.id}
          style={styles.playlistItemWrapper}
          onPress={() => navigate(RouteName.Playlist, { id: playlist.id })}
        >
          <PlaylistItem playlist={playlist} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default FeaturedPlaylists;
