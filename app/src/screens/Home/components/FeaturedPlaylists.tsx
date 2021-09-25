import { LoadingScreen } from "@/components/Loading";
import {
  PlaylistItem,
  useItemHorizontalWidthStyle,
} from "@/components/Playlist";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { usePlaylistsFeaturedQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import scrollStyles from "./ScrollView.styles";

const styles = StyleSheet.create({
  item: {
    marginRight: Size[4],
  },
});

const FeaturedPlaylists: FC = () => {
  const [{ data, fetching }] = usePlaylistsFeaturedQuery();

  const navigation = useNavigation();

  const widthStyle = useItemHorizontalWidthStyle();

  return (
    <ScrollView
      style={scrollStyles.scroll}
      contentContainerStyle={scrollStyles.scrollContent}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {fetching ? (
        <LoadingScreen />
      ) : (
        data?.playlistsFeatured?.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={[styles.item, widthStyle]}
            onPress={() =>
              navigation.navigate(RouteName.Playlist, { id: playlist.id })
            }
          >
            <PlaylistItem playlist={playlist} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default FeaturedPlaylists;
