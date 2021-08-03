import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  useMeQuery,
  useStoryCollabAddFromTokenMutation,
  useStoryQuery,
} from "@auralous/api";
import player, { PlaybackContextType } from "@auralous/player";
import {
  Avatar,
  Button,
  Heading,
  LoadingScreen,
  Size,
  Spacer,
  toast,
} from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: Size[6], justifyContent: "space-between", flex: 1 },
  top: { alignItems: "center", flex: 1 },
});

const StoryInviteScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.StoryInvite>
> = ({ navigation, route }) => {
  const { t } = useTranslation();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const [{ data: dataStory, fetching: fetchingStory }] = useStoryQuery({
    variables: { id: route.params.id },
  });

  const [{ data, fetching }, addCollab] = useStoryCollabAddFromTokenMutation();

  const playAndNavigate = useCallback(() => {
    player.playContext({
      id: route.params.id,
      type: PlaybackContextType.Story,
      shuffle: false,
    });
    navigation.replace(RouteName.Story, { id: route.params.id });
  }, [navigation, route.params.id]);

  useEffect(() => {
    // If user is already a collaborator, redirect right away
    if (me && dataStory?.story?.collaboratorIds.includes(me.user.id)) {
      playAndNavigate();
    }
  }, [dataStory, playAndNavigate, me]);

  const onPress = useCallback(() => {
    if (!me) {
      return navigation.navigate(RouteName.SignIn);
    }
    addCollab(route.params);
  }, [me, navigation, route.params, addCollab]);

  useEffect(() => {
    if (data?.storyCollabAddFromToken === true) {
      playAndNavigate();
    } else if (data?.storyCollabAddFromToken === false) {
      toast(t("story_invite.invite_invalid"));
    }
  }, [data?.storyCollabAddFromToken, t, playAndNavigate]);

  return (
    <View style={styles.root}>
      {fetchingStory || me === undefined ? (
        <LoadingScreen />
      ) : dataStory?.story ? (
        <View style={styles.content}>
          <View style={styles.top}>
            <Avatar
              size={32}
              href={dataStory.story.creator.profilePicture}
              username={dataStory.story.creator.username}
            />
            <Spacer y={4} />
            <Heading level={4} align="center">
              {t("story_invite.title", { name: dataStory.story.text })}
            </Heading>
          </View>
          <Button variant="filled" disabled={fetching} onPress={onPress}>
            {t("story_invite.accept_invitation")}
          </Button>
        </View>
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default StoryInviteScreen;
