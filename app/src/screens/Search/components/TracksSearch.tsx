import { LoadingScreen } from "@/components/Loading";
import { TrackItem } from "@/components/Track";
import player from "@/player";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { Size } from "@/styles/spacing";
import SearchEmpty from "@/views/SongSelector/SearchEmpty";
import type { Track } from "@auralous/api";
import { useSearchTrackQuery } from "@auralous/api";
import type { ListRenderItem } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import type { FC } from "react";
import { memo } from "react";
import { TouchableOpacity } from "react-native";
import { styles } from "./ItemsSearch.styles";

const SearchItem = memo<{ track: Track }>(function SearchItem({ track }) {
  return (
    <TouchableOpacity
      style={styles.itemOneCol}
      onPress={() =>
        player.playContext({
          initialTracks: [track.id],
          shuffle: false,
        })
      }
    >
      <TrackItem track={track} />
    </TouchableOpacity>
  );
});

const renderItem: ListRenderItem<Track> = ({ item }) => (
  <SearchItem track={item} />
);

const itemHeight = Size[12] + 2 * Size[2];

const TracksSearch: FC<{ query: string }> = ({ query }) => {
  const [{ data: dataQuery, fetching }] = useSearchTrackQuery({
    variables: { query },
  });

  const { data, numColumns } = useFlatlist6432Layout(dataQuery?.searchTrack);

  return (
    <FlashList
      key={numColumns}
      renderItem={renderItem}
      data={data}
      ListEmptyComponent={fetching ? LoadingScreen : SearchEmpty}
      estimatedItemSize={itemHeight}
    />
  );
};

export default TracksSearch;
