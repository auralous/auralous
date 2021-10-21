import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { stylesMeta } from "@/screens/_commonContent";
import type { Session } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

const SessionMeta: FC<{
  session: Session;
  tag: ReactNode;
  buttons: ReactNode;
}> = ({ session, tag, buttons }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const gotoCreator = useCallback(() => {
    navigation.navigate(RouteName.User, { username: session.creator.username });
  }, [navigation, session.creator.username]);

  return (
    <View style={stylesMeta.root}>
      <View style={stylesMeta.image}>
        <Avatar
          size={40}
          href={session.creator.profilePicture}
          username={session.creator.username}
        />
      </View>
      <View style={stylesMeta.meta}>
        <View style={stylesMeta.tag}>{tag}</View>
        <Heading level={4} align="center" numberOfLines={1}>
          {session.text}
        </Heading>
        <Spacer y={3} />
        <Pressable onPress={gotoCreator}>
          <Text color="textSecondary" align="center" numberOfLines={1}>
            {session.collaboratorIds.length > 1
              ? t("collab.name_and_x_others", {
                  name: session.creator.username,
                  count: session.collaboratorIds.length - 1,
                })
              : session.creator.username}
          </Text>
        </Pressable>
      </View>
      <View style={stylesMeta.buttons}>{buttons}</View>
    </View>
  );
};

export default SessionMeta;