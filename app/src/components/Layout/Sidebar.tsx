import { IconHome, IconLogo, IconMapPin, IconSearch } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { RNLink, Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { useNavigationState } from "@react-navigation/native";
import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  buttonActive: {
    backgroundColor: Colors.backgroundSecondary,
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
  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  return (
    <RNLink
      to={{ screen: name }}
      style={[
        styles.button,
        navigationRouteName === name && styles.buttonActive,
      ]}
    >
      {icon}
      <Spacer x={3} />
      <Text>{children}</Text>
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
      <SidebarButton name={RouteName.Home} icon={<IconHome />}>
        {t("home.title")}
      </SidebarButton>
      <Spacer y={2} />
      <SidebarButton name={RouteName.Search} icon={<IconSearch />}>
        {t("search.title")}
      </SidebarButton>
      <Spacer y={2} />
      <SidebarButton name={RouteName.Map} icon={<IconMapPin />}>
        {t("map.title")}
      </SidebarButton>
    </View>
  );
};

export default Sidebar;
