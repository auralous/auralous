import {
  Dialog,
  DialogButton,
  DialogContent,
  DialogContentText,
  DialogFooter,
  DialogTitle,
} from "@/components/BottomSheet";
import { RouteName } from "@/screens/types";
import { checkAndRequestPermission } from "@/utils/permission";
import { LocationInput, Story, useStoryUpdateMutation } from "@auralous/api";
import { Size, Spacer, toast } from "@auralous/ui";
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
      await storyUpdate({
        id: story.id,
        location,
      });
      dismissMap();
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
      <Dialog visible={map}>
        <DialogTitle>{t("story_edit.map.prompt")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("story_edit.map.description")}
          </DialogContentText>
          <Spacer y={2} />
          <DialogContentText size="xs" color="textTertiary" style={styles.note}>
            {t("story_edit.map.privacy_note")}
          </DialogContentText>
        </DialogContent>
        <DialogFooter>
          <DialogButton onPress={dismissMap} disabled={fetchingUpdate}>
            {t("common.action.no_thanks")}
          </DialogButton>
          <DialogButton
            variant="primary"
            onPress={addToMap}
            disabled={fetchingUpdate}
          >
            {t("common.action.publish")}
          </DialogButton>
        </DialogFooter>
      </Dialog>
      <Dialog visible={collab} onDismiss={dismissCollab}>
        <DialogTitle>{t("story_edit.collab.prompt")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("story_edit.collab.description")}
          </DialogContentText>
        </DialogContent>
        <DialogFooter>
          <DialogButton onPress={dismissCollab}>
            {t("common.action.later")}
          </DialogButton>
          <DialogButton variant="primary" onPress={gotoCollab}>
            {t("collab.title")}
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  );
};
