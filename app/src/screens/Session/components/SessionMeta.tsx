import { Avatar } from "@/components/Avatar";
import { RNLink } from "@/components/Link";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import { stylesMeta } from "@/screens/common/itemScreen.style";
import { RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const SessionMeta: FC<{
  session: Session;
  tag: ReactNode;
  buttons: ReactNode;
}> = ({ session, tag, buttons }) => {
  const { t } = useTranslation();

  return (
    <View style={stylesMeta.header}>
      <View style={stylesMeta.image}>
        <Avatar
          size={40}
          href={session.creator.profilePicture}
          username={session.creator.username}
        />
      </View>
      <View style={stylesMeta.meta}>
        <View style={stylesMeta.tag}>{tag}</View>
        <Heading level={5} align="center" numberOfLines={1}>
          {session.text}
        </Heading>
        <Spacer y={3} />
        <RNLink
          to={{
            screen: RouteName.User,
            params: { username: session.creator.username },
          }}
        >
          <Text align="center">
            {session.collaboratorIds.length > 1
              ? t("collab.name_and_x_others", {
                  name: session.creator.username,
                  count: session.collaboratorIds.length - 1,
                })
              : session.creator.username}
          </Text>
        </RNLink>
      </View>
      <View style={stylesMeta.buttons}>{buttons}</View>
    </View>
  );
};

export default SessionMeta;
