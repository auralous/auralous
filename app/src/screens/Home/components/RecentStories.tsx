import { RouteName } from "@/screens/types";
import { useStoriesQuery } from "@auralous/api";
import { LoadingScreen, Size, StoryItem } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import scrollStyles from "./ScrollView.styles";

const styles = StyleSheet.create({
  root: {
    height: 296,
  },
  storyItemWrapper: {
    marginRight: Size[4],
  },
});

const RecentStories: FC = () => {
  const [{ data, fetching }] = useStoriesQuery({
    variables: { limit: 10 },
  });

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
        data?.stories?.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItemWrapper}
            onPress={() =>
              navigation.navigate(RouteName.Story, { id: story.id })
            }
          >
            <StoryItem story={story} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default RecentStories;
