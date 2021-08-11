import {
  Dialog,
  DialogButton,
  DialogContent,
  DialogContentText,
  DialogFooter,
  DialogTitle,
  useDialog,
} from "@/components/BottomSheet";
import { Story, useStoryUnliveMutation } from "@auralous/api";
import { Button, Colors, Size, Text, toast } from "@auralous/ui";
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
      <Dialog visible={visible} onDismiss={dismiss}>
        <DialogTitle>{`${t("story_edit.live.unlive")}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("story_edit.live.unlive_prompt")}
          </DialogContentText>
        </DialogContent>
        <DialogFooter>
          <DialogButton onPress={dismiss} disabled={fetching}>
            {t("common.action.cancel")}
          </DialogButton>
          <DialogButton
            onPress={onUnlive}
            variant="primary"
            disabled={fetching}
          >
            {t("common.action.confirm")}
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  );
};
