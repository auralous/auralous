import { Avatar, Heading, Spacer, Text } from "@/components";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles";
import type { Session } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

const SessionMeta: FC<{ session: Session; tagElement: ReactNode }> = ({
  session,
  tagElement,
}) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const gotoCreator = useCallback(() => {
    navigation.navigate(RouteName.User, { username: session.creator.username });
  }, [navigation, session.creator.username]);

  return (
    <View style={styles.root}>
      <Avatar
        size={32}
        href={session.creator.profilePicture}
        username={session.creator.username}
      />
      <Spacer y={2} />
      {tagElement}
      <Spacer y={2} />
      <Heading level={4} align="center">
        {session.text}
      </Heading>
      <Spacer y={3} />
      <Pressable onPress={gotoCreator}>
        <Text color="textSecondary" align="center">
          {session.collaboratorIds.length > 1
            ? t("collab.name_and_x_others", {
                name: session.creator.username,
                count: session.collaboratorIds.length - 1,
              })
            : session.creator.username}
        </Text>
      </Pressable>
    </View>
  );
};

export default SessionMeta;
