import { LocationInput, Story, useStoryUpdateMutation } from "@auralous/api";
import {
  Button,
  Input,
  InputRef,
  Size,
  Spacer,
  Text,
  toast,
} from "@auralous/ui";
import { FC, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
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

  useEffect(() => {
    textRef.current?.setValue(story.text);
  }, [story]);

  const onSubmit = useCallback(async () => {
    const location: LocationInput | null = null;
    const { data } = await storyUpdate({
      id: story.id,
      text: textRef.current?.value || story.text,
      location,
    });
    if (data?.storyUpdate) {
      toast.success(t("story_edit.updated"));
    }
  }, [story, storyUpdate, t]);

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
      <Spacer y={4} />
      <Button variant="primary" disabled={fetching} onPress={onSubmit}>
        {t("common.action.save")}
      </Button>
    </ScrollView>
  );
};
