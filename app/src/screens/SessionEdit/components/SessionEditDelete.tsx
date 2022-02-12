import { Button } from "@/components/Button";
import { Dialog, useDialog } from "@/components/Dialog";
import { toast } from "@/components/Toast";
import player, { useIsCurrentPlaybackContext } from "@/player";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import { useSessionDeleteMutation } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
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

  const sessionId = session.id;

  const [{ fetching }, sessionDelete] = useSessionDeleteMutation();

  const [visible, present, dismiss] = useDialog();

  const navigation = useNavigation();

  const isCurrentPlaybackContext = useIsCurrentPlaybackContext(
    "session",
    sessionId
  );

  const onEnd = useCallback(async () => {
    const result = await sessionDelete({
      id: sessionId,
    });
    if (!result.error) {
      toast.success(t("session_edit.delete.delete_ok"));
      if (isCurrentPlaybackContext) {
        player.playContext(null);
      }
      navigation.navigate(RouteName.Explore, undefined);
    }
  }, [t, sessionDelete, sessionId, navigation, isCurrentPlaybackContext]);

  return (
    <View style={styles.root}>
      <Button variant="text" onPress={present}>
        {t("session_edit.delete.title")}
      </Button>
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
          <Dialog.Button onPress={onEnd} variant="primary" disabled={fetching}>
            {t("common.action.confirm")}
          </Dialog.Button>
        </Dialog.Footer>
      </Dialog.Dialog>
    </View>
  );
};
