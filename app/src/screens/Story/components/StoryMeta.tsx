import { RouteName } from "@/screens/types";
import { Story } from "@auralous/api";
import { Avatar, Heading, Size, Spacer, Text } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

const StoryMeta: FC<{ story: Story; tagElement: ReactNode }> = ({
  story,
  tagElement,
}) => {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const gotoCreator = useCallback(() => {
    navigation.navigate(RouteName.User, { username: story.creator.username });
  }, [navigation, story.creator.username]);

  return (
    <View style={styles.root}>
      <Avatar
        size={32}
        href={story.creator.profilePicture}
        username={story.creator.username}
      />
      <Spacer y={2} />
      {tagElement}
      <Spacer y={2} />
      <Heading level={4} align="center">
        {story.text}
      </Heading>
      <Spacer y={3} />
      <Pressable onPress={gotoCreator}>
        <Text color="textSecondary" align="center">
          {story.collaboratorIds.length > 1
            ? t("collab.name_and_x_others", {
                name: story.creator.username,
                count: story.collaboratorIds.length - 1,
              })
            : story.creator.username}
        </Text>
      </Pressable>
    </View>
  );
};

export default StoryMeta;
