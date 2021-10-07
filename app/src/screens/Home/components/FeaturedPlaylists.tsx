import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { LoadingScreen } from "@/components/Loading";
import { PlaylistItem } from "@/components/Playlist";
import { RouteName } from "@/screens/types";
import type { Playlist } from "@auralous/api";
import { usePlaylistsFeaturedQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import scrollStyles from "./ScrollView.styles";

const FeaturedPlaylists: FC = () => {
  const [{ data, fetching }] = usePlaylistsFeaturedQuery();

  const navigation = useNavigation();
  const renderItem = useCallback<HorizontalListProps<Playlist>["renderItem"]>(
    (info) => (
      <TouchableOpacity
        key={info.item.id}
        style={info.style}
        onPress={() =>
          navigation.navigate(RouteName.Playlist, { id: info.item.id })
        }
      >
        <PlaylistItem playlist={info.item} />
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <HorizontalList
      style={scrollStyles.scroll}
      contentContainerStyle={scrollStyles.scrollContent}
      data={data?.playlistsFeatured}
      renderItem={renderItem}
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
    />
  );
};

export default FeaturedPlaylists;
