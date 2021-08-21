import { Story, useStoryUnliveMutation } from "@auralous/api";
import {
  Button,
  Colors,
  Dialog,
  Size,
  Text,
  toast,
  useDialog,
} from "@auralous/ui";
import { FC, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  liveBanner: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  liveText: {
    flex: 1,
  },
});

export const StoryEditUnlive: FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();

  const [{ fetching }, storyUnlive] = useStoryUnliveMutation();

  const [visible, present, dismiss] = useDialog();

  const onUnlive = useCallback(async () => {
    const { data } = await storyUnlive({
      id: story.id,
    });
    if (data?.storyUnlive) toast(t("story_edit.live.unlive_ok"));
  }, [t, storyUnlive, story.id]);

  return (
    <>
      <View style={styles.liveBanner}>
        <Text style={styles.liveText}>
          <Trans
            t={t}
            i18nKey="story_edit.live.description"
            components={[<Text key="LIVE" bold />]}
          />
        </Text>
        <Button onPress={present}>{t("story_edit.live.unlive")}</Button>
      </View>
      <Dialog.Dialog visible={visible} onDismiss={dismiss}>
        <Dialog.Title>{`${t("story_edit.live.unlive")}?`}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("story_edit.live.unlive_prompt")}
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
    </>
  );
};
