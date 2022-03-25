import { IconLogIn } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { RNLink } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { useRouteNames } from "@/screens/useRouteName";
import { Colors } from "@/styles/colors";
import { useUIDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { mainRoutes } from "./mainRoutes";

export const BOTTOM_TABS_HEIGHT = 48;

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: BOTTOM_TABS_HEIGHT,
    overflow: "hidden",
    width: "100%",
  },
  tab: {
    alignItems: "center",
    borderBottomWidth: 4,
    borderColor: "transparent",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  tabFocused: {
    borderColor: Colors.primary,
  },
});

const Tab: FC<{
  Icon: FC<SvgProps>;
  name: RouteName;
  children: string;
  isFocused: boolean;
}> = ({ Icon, name, isFocused, children }) => {
  return (
    <RNLink
      to={{ screen: RouteName.Main, params: { screen: name } }}
      style={[styles.tab, isFocused && styles.tabFocused]}
      accessibilityLabel={children}
    >
      <Icon color={isFocused ? Colors.text : Colors.textTertiary} />
    </RNLink>
  );
};

const TabProfile: FC = () => {
  const { t } = useTranslation();
  const [{ data }] = useMeQuery();
  const uiDispatch = useUIDispatch();
  if (!data?.me) {
    return (
      <Pressable
        style={styles.tab}
        onPress={() => uiDispatch({ type: "signIn", value: { visible: true } })}
        accessibilityLabel={t("sign_in.title")}
      >
        <IconLogIn color={Colors.textTertiary} />
      </Pressable>
    );
  }
  return (
    <RNLink
      to={{
        screen: RouteName.User,
        params: { username: data.me.user.username },
      }}
      style={styles.tab}
      accessibilityLabel={t("sign_in.title")}
    >
      <Avatar username={data.me.user.username} size={8} />
    </RNLink>
  );
};

const mainRouteNames = mainRoutes.map((mr) => mr.name);
const BottomTabs: FC = () => {
  const { t } = useTranslation();

  const routeNames = useRouteNames();
  const routeName = routeNames[routeNames.length - 1];

  const [lastRouteName, setLastRouteName] = useState(RouteName.Explore);
  useEffect(() => {
    if (mainRouteNames.includes(routeName)) setLastRouteName(routeName);
  }, [routeName]);

  return (
    <View style={styles.root}>
      {mainRoutes.map((mainRoute) => (
        <Fragment key={mainRoute.name}>
          <Tab
            name={mainRoute.name}
            Icon={mainRoute.Icon}
            isFocused={lastRouteName === mainRoute.name}
          >
            {t(mainRoute.tTitle)}
          </Tab>
          <Spacer y={2} />
        </Fragment>
      ))}
      <Spacer y={2} />
      <TabProfile />
    </View>
  );
};

export default BottomTabs;
