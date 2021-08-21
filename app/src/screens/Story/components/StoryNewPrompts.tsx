import { RouteName } from "@/screens/types";
import { checkAndRequestPermission } from "@/utils/permission";
import { LocationInput, Story, useStoryUpdateMutation } from "@auralous/api";
import { Dialog, Size, Spacer, toast } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Geolocation from "react-native-geolocation-service";

const styles = StyleSheet.create({
  note: {
    marginTop: Size[1],
  },
});

export const StoryNewPrompts: FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();

  const [map, setMap] = useState(true);
  const [collab, setCollab] = useState(false);

  const dismissMap = useCallback(() => {
    setMap(false);
    setCollab(true);
  }, []);

  const [{ fetching: fetchingUpdate }, storyUpdate] = useStoryUpdateMutation();

  const addToMap = useCallback(async () => {
    // perform permission check
    const hasPermission = await checkAndRequestPermission();
    if (!hasPermission) {
      return toast.error(t("permission.location.not_allowed"));
    }
    try {
      const location = await new Promise<LocationInput>((resolve, reject) => {
        Geolocation.getCurrentPosition((position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }, reject);
      });
      const result = await storyUpdate({
        id: story.id,
        location,
      });
      if (!result.error) {
        dismissMap();
      }
    } catch (err) {
      return toast.error(err.message);
    }
  }, [story.id, dismissMap, storyUpdate, t]);

  const dismissCollab = useCallback(() => {
    setCollab(false);
  }, []);

  const navigation = useNavigation();

  const gotoCollab = useCallback(() => {
    dismissCollab();
    navigation.navigate(RouteName.StoryCollaborators, { id: story.id });
  }, [story.id, navigation, dismissCollab]);

  return (
    <>
      <Dialog.Dialog visible={map}>
        <Dialog.Title>{t("story_edit.map.prompt")}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("story_edit.map.description")}
          </Dialog.ContentText>
          <Spacer y={2} />
          <Dialog.ContentText
            size="xs"
            color="textTertiary"
            style={styles.note}
          >
            {t("story_edit.map.privacy_note")}
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
        <Dialog.Title>{t("story_edit.collab.prompt")}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ContentText>
            {t("story_edit.collab.description")}
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
