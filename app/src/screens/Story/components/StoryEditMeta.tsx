import { checkAndRequestPermission } from "@/utils/permission";
import { LocationInput, Story, useStoryUpdateMutation } from "@auralous/api";
import {
  Button,
  Colors,
  Input,
  InputRef,
  Size,
  Spacer,
  Text,
  toast,
} from "@auralous/ui";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { Switch } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  checkbox: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  content: { flex: 1, padding: Size[4] },
  contentContainer: {
    alignItems: "center",
  },
  item: { marginBottom: Size[8], width: "100%" },
});

export const StoryEditMeta: FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();
  const [{ fetching }, storyUpdate] = useStoryUpdateMutation();

  const textRef = useRef<InputRef>(null);
  const [onMap, setOnMap] = useState(!!story.onMap);

  useEffect(() => {
    textRef.current?.setValue(story.text);
    setOnMap(!!story.onMap);
  }, [story]);

  const onSubmit = useCallback(async () => {
    let location: LocationInput | null = null;
    if (onMap) {
      // perform permission check
      const hasPermission = await checkAndRequestPermission();
      if (!hasPermission) {
        return toast.error(t("permission.location.not_allowed"));
      }
      try {
        location = await new Promise<LocationInput>((resolve, reject) => {
          Geolocation.getCurrentPosition((position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }, reject);
        });
      } catch (err) {
        return toast.error(err.message);
      }
    }
    const { data } = await storyUpdate({
      id: story.id,
      text: textRef.current?.value || story.text,
      location,
    });
    if (data?.storyUpdate) {
      toast.success(t("story_edit.updated"));
    }
  }, [story, storyUpdate, onMap, t]);

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.item}>
        <Text align="center" bold>
          {t("story.text")}
        </Text>
        <Spacer y={2} />
        <Input
          ref={textRef}
          accessibilityLabel={t("story.text")}
          defaultValue={story.text}
        />
      </View>
      <View style={[styles.item, !story.isLive && { opacity: 0.5 }]}>
        <Text align="center" bold>
          {t("map.title_branded")}
        </Text>
        <Text align="center" color="textSecondary" size="sm">
          {t("story_edit.add_to_map_description")}
        </Text>
        <Spacer y={2} />
        <View style={styles.checkbox}>
          <Switch
            accessibilityLabel={t("story_edit.add_to_map")}
            value={onMap}
            onValueChange={setOnMap}
            thumbColor={Colors.primary}
            trackColor={{ false: Colors.controlDark, true: Colors.control }}
            disabled={!story.isLive}
          />
        </View>
      </View>
      <Spacer y={4} />
      <Button variant="primary" disabled={fetching} onPress={onSubmit}>
        {t("common.action.save")}
      </Button>
    </ScrollView>
  );
};
