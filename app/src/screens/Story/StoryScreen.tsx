import { PageHeaderGradient } from "@/components/Colors";
import { NotFoundScreen } from "@/components/NotFound";
import { useRootSheetModalsSetter } from "@/components/RootSheetModals";
import { ParamList, RouteName } from "@/screens/types";
import { useMeQuery, useStoryQuery } from "@auralous/api";
import {
  Colors,
  IconEdit,
  IconMoreVertical,
  IconShare2,
  LoadingScreen,
  TextButton,
} from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Config from "react-native-config";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
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

  const rootSheetModalsSetter = useRootSheetModalsSetter();

  useEffect(() => {
    const story = data?.story;
    if (!story) return;
    navigation.setOptions({
      headerRight() {
        return (
          <TextButton
            icon={<IconMoreVertical width={21} height={21} />}
            accessibilityLabel={t("common.navigation.open_menu")}
            onPress={() => {
              rootSheetModalsSetter.actionSheet({
                visible: true,
                title: story.text,
                subtitle: story.creator.username,
                image: story.image || undefined,
                items: [
                  ...(story.creatorId === me?.user.id
                    ? [
                        {
                          icon: <IconEdit stroke={Colors.textSecondary} />,
                          text: t("story_edit.title"),
                          onPress() {
                            navigation.navigate(RouteName.StoryEdit, {
                              id: story.id,
                            });
                          },
                        },
                      ]
                    : []),
                  {
                    icon: <IconShare2 stroke={Colors.textSecondary} />,
                    text: t("share.share"),
                    onPress() {
                      Share.open({
                        title: story.text,
                        url: `${Config.WEB_URI}/story/${story.id}`,
                      }).catch(() => undefined);
                    },
                  },
                ],
              });
            }}
          />
        );
      },
    });
  }, [navigation, me, data, t, rootSheetModalsSetter]);

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
