import { StoryPager } from "@/components/Story/StoryPager";
import { ParamList, RouteName } from "@/screens/types";
import { Story } from "@auralous/api";
import player from "@auralous/player";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { MapMap } from "./components/MapMap";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const MapScreen: FC<NativeStackScreenProps<ParamList, RouteName.Map>> = () => {
  const [stories, setStories] = useState<Story[]>([]);

  const onClose = useCallback(() => {
    player.playContext(null);
    setStories([]);
  }, []);

  const onStoryPaged = useCallback((story: Story) => {
    player.playContext({
      id: story.id,
      shuffle: false,
      type: "story",
    });
  }, []);

  return (
    <View style={styles.root}>
      <MapMap setStories={setStories} />
      <StoryPager
        stories={stories}
        onClose={onClose}
        visible={stories.length > 0}
        onStoryPaged={onStoryPaged}
      />
    </View>
  );
};

export default MapScreen;
