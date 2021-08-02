import { PageHeaderGradient } from "@/components/Colors";
import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useStoryQuery } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StoryLiveContent from "./components/StoryLiveContent";
import StoryNonLiveContent from "./components/StoryNonLiveContent";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const StoryScreen: FC<NativeStackScreenProps<ParamList, RouteName.Story>> = ({
  route,
}) => {
  const [{ data, fetching }] = useStoryQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  return (
    <SafeAreaView style={styles.root}>
      <PageHeaderGradient image={data?.story?.image} />
      {fetching ? (
        <LoadingScreen />
      ) : data?.story ? (
        data.story.isLive ? (
          <StoryLiveContent story={data.story} />
        ) : (
          <StoryNonLiveContent story={data.story} />
        )
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default StoryScreen;
