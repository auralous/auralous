import { RouteName } from "@/screens/types";
import { Session, useSessionDeleteMutation } from "@auralous/api";
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

export const SessionEditDelete: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();

  const [{ fetching }, sessionDelete] = useSessionDeleteMutation();

  const [visible, present, dismiss] = useDialog();

  const navigation = useNavigation();

  const playbackCurrentContext = usePlaybackCurrentContext();

  const onUnlive = useCallback(async () => {
    const sessionId = session.id;
    const result = await sessionDelete({
      id: sessionId,
    });
    if (!result.error) {
      toast.success(t("session_edit.delete.delete_ok"));
      if (
        playbackCurrentContext?.type === "session" &&
        playbackCurrentContext.id === sessionId
      ) {
        player.playContext(null);
      }
      navigation.navigate(RouteName.Home);
    }
  }, [t, sessionDelete, session.id, navigation, playbackCurrentContext]);

  return (
    <View style={styles.root}>
      <TextButton onPress={present}>
        {t("session_edit.delete.title")}
      </TextButton>
      <Dialog.Dialog visible={visible} onDismiss={dismiss}>
        <Dialog.Title>{`${t("session_edit.delete.title")}?`}</Dialog.Title>
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
