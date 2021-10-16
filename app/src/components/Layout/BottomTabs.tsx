import {
  IconActivity,
  IconHome,
  IconLogIn,
  IconMapPin,
  IconSearch,
} from "@/assets";
import { Spacer } from "@/components/Spacer";
import { RNLink } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { useUiDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import { useNavigationState } from "@react-navigation/native";
import type { FC, NamedExoticComponent } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { Avatar } from "../Avatar";

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flexDirection: "row",
    height: 56,
    width: "100%",
  },
  tab: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
});

const hiddenRoutes = [
  RouteName.NewFinal,
  RouteName.NewQuickShare,
  RouteName.NewSelectSongs,
] as string[];

const Tab: FC<{
  Icon: NamedExoticComponent<SvgProps>;
  name: RouteName;
  navigationRouteName: string;
  children: string;
}> = ({ Icon, name, navigationRouteName, children }) => {
  const isActive = navigationRouteName === name;

  return (
    <RNLink
      to={{ screen: name }}
      style={styles.tab}
      accessibilityLabel={children}
    >
      <Icon color={isActive ? Colors.text : Colors.textTertiary} />
    </RNLink>
  );
};

const TabProfile: FC = () => {
  const { t } = useTranslation();
  const [{ data }] = useMeQuery();
  const uiDispatch = useUiDispatch();
  if (!data?.me)
    return (
      <Pressable
        style={styles.tab}
        onPress={() => uiDispatch({ type: "signIn", value: { visible: true } })}
        accessibilityLabel={this}
      >
        <IconLogIn color={Colors.textTertiary} />
      </Pressable>
    );
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

const BottomTabs: FC = () => {
  const { t } = useTranslation();

  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  if (hiddenRoutes.includes(navigationRouteName)) return null;

  return (
    <View style={styles.root}>
      <Tab
        name={RouteName.Home}
        Icon={IconHome}
        navigationRouteName={navigationRouteName}
      >
        {t("home.title")}
      </Tab>
      <Spacer y={2} />
      <Tab
        name={RouteName.Explore}
        Icon={IconSearch}
        navigationRouteName={navigationRouteName}
      >
        {t("explore.title")}
      </Tab>
      <Spacer y={2} />
      <Tab
        name={RouteName.Map}
        Icon={IconMapPin}
        navigationRouteName={navigationRouteName}
      >
        {t("map.title")}
      </Tab>
      <Spacer y={2} />
      <Tab
        name={RouteName.Notifications}
        Icon={IconActivity}
        navigationRouteName={navigationRouteName}
      >
        {t("notification.title")}
      </Tab>
      <Spacer y={2} />
      <TabProfile />
    </View>
  );
};

export default BottomTabs;
