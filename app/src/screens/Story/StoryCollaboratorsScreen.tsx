import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  useMeQuery,
  useStoryInviteLinkQuery,
  useStoryQuery,
  useUserQuery,
} from "@auralous/api";
import { Avatar, Button, LoadingScreen, Size, Text } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Share from "react-native-share";

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flex: 1,
    paddingVertical: Size[4],
    paddingHorizontal: Size[4],
  },
  item: {
    flexDirection: "row",
    width: "100%",
    marginBottom: Size[4],
    alignItems: "center",
  },
  text: {
    marginHorizontal: Size[3],
    flex: 1,
  },
  invite: {
    padding: Size[2],
  },
});

const StoryCollaborator: FC<{
  id: string;
  userId: string;
}> = ({ userId }) => {
  const [{ data: dataUser }] = useUserQuery({ variables: { id: userId } });

  if (!dataUser?.user) return null;
  return (
    <View style={styles.item}>
      <Avatar
        size={12}
        username={dataUser.user.username}
        href={dataUser.user.profilePicture}
      />
      <Text bold style={styles.text}>
        {dataUser.user.username}
      </Text>
    </View>
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
          <Button onPress={onInvitePress}>{t("share.invite_friends")}</Button>
        </View>
      )}
    </View>
  );
};

export default StoryCollaboratorsScreen;
