import { IconActivity, IconLogIn, IconMapPin, IconSearch } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { RNLink } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { LayoutSize } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { FC, NamedExoticComponent } from "react";
import { useTranslation } from "react-i18next";
import type { ViewStyle } from "react-native";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import type { SvgProps } from "react-native-svg";

export const BOTTOM_TABS_HEIGHT = 48;

const styles = StyleSheet.create({
  hidden: {
    height: 0,
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flexDirection: "row",
    height: BOTTOM_TABS_HEIGHT,
    overflow: "hidden",
    width: "100%",
  },
  tab: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
});

const Tab: FC<{
  Icon: NamedExoticComponent<SvgProps>;
  name: RouteName;
  children: string;
  isFocused: boolean;
}> = ({ Icon, name, isFocused, children }) => {
  return (
    <RNLink
      to={{ screen: name }}
      style={styles.tab}
      accessibilityLabel={children}
    >
      <Icon color={isFocused ? Colors.text : Colors.textTertiary} />
    </RNLink>
  );
};

const TabProfile: FC = () => {
  const { t } = useTranslation();
  const [{ data }] = useMeQuery();
  const uiDispatch = useUiDispatch();
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

const BottomTabs: FC<BottomTabBarProps> = ({ state, descriptors }) => {
  const { t } = useTranslation();
  const windowWidth = useWindowDimensions().width;
  const isLandscape = windowWidth >= LayoutSize.md;
  return (
    <View
      style={[
        styles.root,
        descriptors[state.routes[state.index].key].options
          .tabBarStyle as ViewStyle,
        isLandscape && styles.hidden,
      ]}
      {...(isLandscape && {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      })}
    >
      <Tab
        name={RouteName.Explore}
        Icon={IconSearch}
        isFocused={state.index === 0}
      >
        {t("explore.title")}
      </Tab>
      <Spacer y={2} />
      <Tab name={RouteName.Map} Icon={IconMapPin} isFocused={state.index === 1}>
        {t("map.title")}
      </Tab>
      <Spacer y={2} />
      <Tab
        name={RouteName.Notifications}
        Icon={IconActivity}
        isFocused={state.index === 2}
      >
        {t("notifications.title")}
      </Tab>
      <Spacer y={2} />
      <TabProfile />
    </View>
  );
};

export default BottomTabs;
