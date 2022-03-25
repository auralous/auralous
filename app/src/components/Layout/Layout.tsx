import { PLAYER_BAR_HEIGHT } from "@/player-components/PlayerBar";
import { useIsFullscreenRoute } from "@/screens/useRouteName";
import { LayoutSize } from "@/styles/spacing";
import type { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import BottomTabs from "./BottomTabs";
import Sidebar from "./Sidebar";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingBottom: PLAYER_BAR_HEIGHT,
  },
  mainFs: {
    paddingBottom: 0,
  },
  root: {
    flex: 1,
  },
});

const isLandscape = Dimensions.get("window").width >= LayoutSize.md;
const Layout: FC = ({ children }) => {
  const isFsRoute = useIsFullscreenRoute();
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.root, { flexDirection: isLandscape ? "row" : "column" }]}
    >
      {isLandscape && <Sidebar />}
      <View style={[styles.main, isFsRoute && styles.mainFs]}>{children}</View>
      {!isLandscape && !isFsRoute && <BottomTabs />}
    </View>
  );
};

export default Layout;
