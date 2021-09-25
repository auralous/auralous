import {
  LoadingScreen,
  PlaylistItem,
  useItemHorizontalWidthStyle,
} from "@/components";
import { useUiNavigate } from "@/context";
import { Size } from "@/styles";
import { usePlaylistsFeaturedQuery } from "@auralous/api";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import scrollStyles from "./ScrollView.styles";

const styles = StyleSheet.create({
  item: {
    marginRight: Size[4],
  },
});

const FeaturedPlaylists: FC = () => {
  const [{ data, fetching }] = usePlaylistsFeaturedQuery();

  const navigate = useUiNavigate();

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
            onPress={() => navigate("playlist", { id: playlist.id })}
          >
            <PlaylistItem playlist={playlist} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default FeaturedPlaylists;
