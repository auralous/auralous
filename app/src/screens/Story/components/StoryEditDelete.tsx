import { RouteName } from "@/screens/types";
import { Story, useStoryDeleteMutation } from "@auralous/api";
import player, { usePlaybackCurrentContext } from "@auralous/player";
import { Dialog, Size, TextButton, toast, useDialog } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: Size[4],
  },
});

export const StoryEditDelete: FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();

  const [{ fetching }, storyDelete] = useStoryDeleteMutation();

  const [visible, present, dismiss] = useDialog();

  const navigation = useNavigation();

  const playbackCurrentContext = usePlaybackCurrentContext();

  const onUnlive = useCallback(async () => {
    const storyId = story.id;
    const { data } = await storyDelete({
      id: storyId,
    });
    if (data?.storyDelete) {
      toast(t("story_edit.delete.delete_ok"));
      if (
        playbackCurrentContext?.type === "story" &&
        playbackCurrentContext.id === storyId
      ) {
        player.playContext(null);
      }
      navigation.navigate(RouteName.Home);
    }
  }, [t, storyDelete, story.id, navigation, playbackCurrentContext]);

  return (
    <View style={styles.root}>
      <TextButton onPress={present}>{t("story_edit.delete.title")}</TextButton>
      <Dialog.Dialog visible={visible} onDismiss={dismiss}>
        <Dialog.Title>{`${t("story_edit.delete.title")}?`}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("common.prompt.action_not_revertable")}
          </Dialog.ContentText>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Button onPress={dismiss} disabled={fetching}>
            {t("common.action.cancel")}
          </Dialog.Button>
          <Dialog.Button
            onPress={onUnlive}
            variant="primary"
            disabled={fetching}
          >
            {t("common.action.confirm")}
          </Dialog.Button>
        </Dialog.Footer>
      </Dialog.Dialog>
    </View>
  );
};
