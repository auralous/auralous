import { Button } from "@/components/Button";
import { Dialog, useDialog } from "@/components/Dialog";
import { toast } from "@/components/Toast";
import { Text } from "@/components/Typography";
import type { ParamList, RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import { useSessionEndMutation } from "@auralous/api";
import { useRoute } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
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

export const SessionEditEnd: FC<{ session: Session }> = ({ session }) => {
  const routeShowEndModal = (
    useRoute()?.params as ParamList[RouteName.SessionEdit]
  ).showEndModal;

  const { t } = useTranslation();

  const [{ fetching }, sessionEnd] = useSessionEndMutation();

  const [visible, present, dismiss] = useDialog();
  useEffect(() => {
    if (routeShowEndModal) {
      present();
    }
  }, [routeShowEndModal, present]);

  const onEnd = useCallback(async () => {
    dismiss();
    const result = await sessionEnd({
      id: session.id,
    });
    if (!result.error) {
      toast.success(t("session_edit.live.end_ok"));
    }
  }, [t, sessionEnd, session.id, dismiss]);

  return (
    <>
      <View style={styles.liveBanner}>
        <Text style={styles.liveText}>
          <Trans
            t={t}
            i18nKey="session_edit.live.description"
            components={[<Text key="LIVE" bold />]}
          />
        </Text>
        <Button onPress={present}>{t("session_edit.live.end")}</Button>
      </View>
      <Dialog.Dialog visible={visible} onDismiss={dismiss}>
        <Dialog.Title>{`${t("session_edit.live.end")}?`}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("session_edit.live.end_prompt")}
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
    </>
  );
};
