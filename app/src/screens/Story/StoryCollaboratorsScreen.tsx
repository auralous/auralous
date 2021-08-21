import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  useMeQuery,
  useStoryInviteLinkQuery,
  useStoryQuery,
  useUserQuery,
} from "@auralous/api";
import { Button, LoadingScreen, Size, UserListItem } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Share from "react-native-share";

const styles = StyleSheet.create({
  invite: {
    padding: Size[2],
  },
  item: {
    marginBottom: Size[4],
    width: "100%",
  },
  root: { flex: 1 },
  scroll: {
    flex: 1,
    paddingHorizontal: Size[4],
    paddingVertical: Size[4],
  },
});

const StoryCollaborator: FC<{
  id: string;
  userId: string;
}> = ({ userId }) => {
  const [{ data, fetching }] = useUserQuery({
    variables: { id: userId },
  });

  const navigation = useNavigation();

  const onPress = useCallback(
    () =>
      data?.user &&
      navigation.navigate(RouteName.User, { username: data.user.username }),
    [navigation, data]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <UserListItem user={data?.user || null} fetching={fetching} />
    </TouchableOpacity>
  );
};

const StoryCollaboratorsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Story>
> = ({ route }) => {
  const { t } = useTranslation();

  const [{ data: dataStory, fetching }] = useStoryQuery({
    variables: { id: route.params.id },
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const shouldShowInviteButton = Boolean(
    dataStory?.story &&
      me &&
      dataStory.story.collaboratorIds.includes(me.user.id)
  );

  const [{ data: dataStoryInviteLink }] = useStoryInviteLinkQuery({
    variables: { id: route.params.id },
    pause: !shouldShowInviteButton,
  });

  const onInvitePress = useCallback(() => {
    Share.open({
      title: t("story_invite.title", { name: dataStory?.story?.text }),
      url: dataStoryInviteLink?.storyInviteLink,
    }).catch(() => undefined);
  }, [t, dataStory?.story?.text, dataStoryInviteLink?.storyInviteLink]);

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : dataStory?.story ? (
        <ScrollView style={styles.scroll}>
          {dataStory.story.collaboratorIds.map((collaboratorId) => (
            <StoryCollaborator
              key={collaboratorId}
              id={route.params.id}
              userId={collaboratorId}
            />
          ))}
        </ScrollView>
      ) : (
        <NotFoundScreen />
      )}
      {shouldShowInviteButton && dataStoryInviteLink && (
        <View style={styles.invite}>
          <Button variant="primary" onPress={onInvitePress}>
            {t("share.invite_friends")}
          </Button>
        </View>
      )}
    </View>
  );
};

export default StoryCollaboratorsScreen;
