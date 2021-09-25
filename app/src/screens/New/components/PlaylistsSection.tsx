import {
  PlaylistItem,
  useItemHorizontalWidthStyle,
} from "@/components/Playlist";
import { Heading } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  item: {
    marginRight: Size[4],
  },
  root: {
    marginBottom: Size[4],
    paddingHorizontal: Size[6],
  },
  scroll: {
    marginHorizontal: -Size[6],
  },
  scrollContent: { paddingHorizontal: Size[6] },
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
  const widthStyle = useItemHorizontalWidthStyle();

  return (
    <View style={styles.root}>
      <Heading style={styles.title} level={6}>
        {title}
      </Heading>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {playlists.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={[styles.item, widthStyle]}
            onPress={() => onSelect(playlist)}
          >
            <PlaylistItem playlist={playlist} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PlaylistsSection;
