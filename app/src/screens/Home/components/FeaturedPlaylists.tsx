import { RouteName } from "@/screens/types";
import { usePlaylistsFeaturedQuery } from "@auralous/api";
import { LoadingScreen, PlaylistItem, Size } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import scrollStyles from "./ScrollView.styles";

const styles = StyleSheet.create({
  item: {
    marginRight: Size[4],
  },
  root: {
    height: Size[44],
  },
});

const FeaturedPlaylists: FC = () => {
  const [{ data, fetching }] = usePlaylistsFeaturedQuery();

  const navigation = useNavigation();

  return (
    <ScrollView
      style={[scrollStyles.scroll, styles.root]}
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
            style={styles.item}
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
