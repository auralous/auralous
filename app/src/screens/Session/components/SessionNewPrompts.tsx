import { Dialog } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { toast } from "@/components/Toast";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import {
  getCurrentPosition,
  requestLocationPermission,
} from "@/utils/location";
import type { LocationInput, Session } from "@auralous/api";
import { useSessionUpdateMutation } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  note: {
    marginTop: Size[1],
  },
});

export const SessionNewPrompts: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();

  const [map, setMap] = useState(true);
  const [collab, setCollab] = useState(false);

  const dismissMap = useCallback(() => {
    setMap(false);
    setCollab(true);
  }, []);

  const [{ fetching: fetchingUpdate }, sessionUpdate] =
    useSessionUpdateMutation();

  const addToMap = useCallback(async () => {
    // perform permission check
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return toast.error(t("permission.location.not_allowed"));
    }
    let location: LocationInput;
    try {
      location = await getCurrentPosition();
    } catch (err) {
      return toast.error((err as Error).message);
    }
    const result = await sessionUpdate({
      id: session.id,
      location,
    });
    if (!result.error) {
      dismissMap();
    }
  }, [session.id, dismissMap, sessionUpdate, t]);

  const dismissCollab = useCallback(() => {
    setCollab(false);
  }, []);

  const navigation = useNavigation();

  const gotoCollab = useCallback(() => {
    dismissCollab();
    navigation.navigate(RouteName.SessionCollaborators, { id: session.id });
  }, [session.id, navigation, dismissCollab]);

  return (
    <>
      <Dialog.Dialog visible={map}>
        <Dialog.Title>{t("session_edit.map.prompt")}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("session_edit.map.description")}
          </Dialog.ContentText>
          <Spacer y={2} />
          <Dialog.ContentText
            size="xs"
            color="textTertiary"
            style={styles.note}
          >
            {t("session_edit.map.privacy_note")}
          </Dialog.ContentText>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Button onPress={dismissMap} disabled={fetchingUpdate}>
            {t("common.action.no_thanks")}
          </Dialog.Button>
          <Dialog.Button
            variant="primary"
            onPress={addToMap}
            disabled={fetchingUpdate}
          >
            {t("common.action.publish")}
          </Dialog.Button>
        </Dialog.Footer>
      </Dialog.Dialog>
      <Dialog.Dialog visible={collab} onDismiss={dismissCollab}>
        <Dialog.Title>{t("session_edit.collab.prompt")}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("session_edit.collab.description")}
          </Dialog.ContentText>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Button onPress={dismissCollab}>
            {t("common.action.later")}
          </Dialog.Button>
          <Dialog.Button variant="primary" onPress={gotoCollab}>
            {t("collab.title")}
          </Dialog.Button>
        </Dialog.Footer>
      </Dialog.Dialog>
    </>
  );
};
