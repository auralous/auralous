import { IconActivity, IconLogIn, IconLogo, IconSearch } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { RNLink, Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { useRouteNames } from "@/screens/useRouteName";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { useUIDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderColor: "transparent",
    borderLeftWidth: 4,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  buttonActive: {
    borderColor: Colors.primary,
  },
  logo: {
    padding: Size[8],
  },
  root: {
    borderRightColor: Colors.border,
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: Size[2],
    width: Dimensions.get("window").width >= LayoutSize.lg ? 260 : 220,
  },
});

const SidebarButton: FC<{ icon: ReactNode; name: RouteName }> = ({
  children,
  icon,
  name,
}) => {
  const routeNames = useRouteNames();
  const routeName = routeNames[routeNames.length - 1];

  return (
    <RNLink
      to={{
        screen: RouteName.Main,
        params: {
          screen: name,
        },
      }}
      style={[styles.button, routeName === name && styles.buttonActive]}
    >
      {icon}
      <Spacer x={3} />
      <Text>{children}</Text>
    </RNLink>
  );
};

const SidebarButtonProfile: FC = () => {
  const { t } = useTranslation();
  const [{ data }] = useMeQuery();
  const uiDispatch = useUIDispatch();
  if (!data?.me)
    return (
      <Pressable
        style={styles.button}
        onPress={() => uiDispatch({ type: "signIn", value: { visible: true } })}
      >
        <IconLogIn />
        <Spacer x={3} />
        <Text>{t("sign_in.title")}</Text>
      </Pressable>
    );
  return (
    <RNLink
      to={{
        screen: RouteName.User,
        params: { username: data.me.user.username },
      }}
      style={styles.button}
    >
      <Avatar username={data.me.user.username} size={8} />
      <Spacer x={3} />
      <Text>{data.me.user.username}</Text>
    </RNLink>
  );
};

const Sidebar: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <View style={styles.logo}>
        <IconLogo />
      </View>
      <SidebarButton name={RouteName.Explore} icon={<IconSearch />}>
        {t("explore.title")}
      </SidebarButton>
      <Spacer y={2} />
      <SidebarButton name={RouteName.Notifications} icon={<IconActivity />}>
        {t("notifications.title")}
      </SidebarButton>
      <Spacer y={2} />
      <SidebarButtonProfile />
    </View>
  );
};

export default Sidebar;
