import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { PlaylistItem } from "@/components/Playlist";
import { Heading } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    marginBottom: Size[4],
    paddingHorizontal: Size[6],
  },
  title: {
    marginBottom: Size[3],
  },
});

interface PlaylistsSectionProps {
  playlists: Playlist[];
  title: string;
  onSelect(playlist: Playlist): void;
}

const PlaylistsSection: FC<PlaylistsSectionProps> = ({
  playlists,
  title,
  onSelect,
}) => {
  const renderItem = useCallback<HorizontalListProps<Playlist>["renderItem"]>(
    (info) => (
      <TouchableOpacity
        key={info.item.id}
        style={info.style}
        onPress={() => onSelect(info.item)}
      >
        <PlaylistItem playlist={info.item} />
      </TouchableOpacity>
    ),
    [onSelect]
  );

  return (
    <View style={styles.root}>
      <Heading style={styles.title} level={6}>
        {title}
      </Heading>
      <HorizontalList data={playlists} renderItem={renderItem} />
    </View>
  );
};

export default PlaylistsSection;
