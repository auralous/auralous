import { IconBell, IconSettings } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { TextButton } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  col: {
    alignItems: "center",
    flexDirection: "row",
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[4],
    paddingHorizontal: Size[6],
    paddingVertical: Size[1],
  },
  signIn: {
    alignItems: "center",
    flexDirection: "row",
  },
});

const HomeHeader: FC = () => {
  const { t } = useTranslation();
  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const uiDispatch = useUiDispatch();

  const navigation = useNavigation();

  const gotoSettings = useCallback(
    () => navigation.navigate(RouteName.Settings),
    [navigation]
  );

  const gotoNotifications = useCallback(
    () => navigation.navigate(RouteName.Notifications),
    [navigation]
  );

  const gotoUser = useCallback(
    () =>
      me &&
      navigation.navigate(RouteName.User, {
        username: me.user.username,
      }),
    [navigation, me]
  );

  return (
    <View style={styles.root}>
      <View style={styles.col}>
        {me ? (
          <Pressable onPress={gotoUser}>
            <Avatar
              size={8}
              href={me.user.profilePicture}
              username={me.user.username}
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={() =>
              uiDispatch({ type: "signIn", value: { visible: true } })
            }
            style={styles.signIn}
          >
            <Avatar size={8} username="" />
            <Spacer x={2} />
            <Text color="textSecondary" size="sm" bold>
              {t("sign_in.title")}
            </Text>
          </Pressable>
        )}
      </View>
      <View style={styles.col}>
        <TextButton
          icon={<IconBell strokeWidth={1} />}
          accessibilityLabel={t("notifications.title")}
          onPress={gotoNotifications}
        />
        <Spacer x={2} />
        <TextButton
          icon={<IconSettings strokeWidth={1} />}
          accessibilityLabel={t("settings.title")}
          onPress={gotoSettings}
        />
      </View>
    </View>
  );
};

export default HomeHeader;
