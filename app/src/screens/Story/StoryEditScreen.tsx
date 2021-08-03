import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { Story, useStoryQuery } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { StoryEditDelete } from "./components/StoryEditDelete";
import { StoryEditMeta } from "./components/StoryEditMeta";
import { StoryEditUnlive } from "./components/StoryEditUnlive";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const StoryEditInner: FC<{ story: Story }> = ({ story }) => {
  return (
    <>
      {story.isLive && <StoryEditUnlive story={story} />}
      <StoryEditMeta story={story} />
      <StoryEditDelete story={story} />
    </>
  );
};

const StoryEditScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.StoryEdit>
> = ({ route }) => {
  const [{ data, fetching }] = useStoryQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.story ? (
        <StoryEditInner story={data.story} />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default StoryEditScreen;
