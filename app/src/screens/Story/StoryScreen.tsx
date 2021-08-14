import { PageHeaderGradient } from "@/components/Colors";
import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useMeQuery, useStoryQuery } from "@auralous/api";
import { IconEdit, LoadingScreen, TextButton } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import StoryLiveContent from "./components/StoryLiveContent";
import { StoryNewPrompts } from "./components/StoryNewPrompts";
import StoryNonLiveContent from "./components/StoryNonLiveContent";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const StoryScreen: FC<NativeStackScreenProps<ParamList, RouteName.Story>> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useStoryQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(() => {
    const story = data?.story;
    if (story && story.creatorId === me?.user.id) {
      navigation.setOptions({
        headerRight() {
          return (
            <GestureHandlerRootView>
              <TextButton
                icon={<IconEdit width={21} height={21} />}
                onPress={() =>
                  navigation.navigate(RouteName.StoryEdit, { id: story.id })
                }
                accessibilityLabel={t("story_edit.title")}
              />
            </GestureHandlerRootView>
          );
        },
      });
    } else {
      navigation.setOptions({
        headerRight: undefined,
      });
    }
  }, [navigation, me, data, t]);

  return (
    <SafeAreaView style={styles.root}>
      <PageHeaderGradient image={data?.story?.image} />
      {fetching ? (
        <LoadingScreen />
      ) : data?.story ? (
        data.story.isLive ? (
          <>
            <StoryLiveContent story={data.story} />
            {route.params.isNew && <StoryNewPrompts story={data.story} />}
          </>
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
