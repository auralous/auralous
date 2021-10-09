import { PlayerView } from "@/player-components";
import { LayoutSize } from "@/styles/spacing";
import type { FC } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import BottomTabs from "./BottomTabs";
import Sidebar from "./Sidebar";

const styles = StyleSheet.create({
  inner: {
    flexDirection: "row",
    flex: 1,
  },
  root: {
    flex: 1,
  },
});

const Layout: FC = ({ children }) => {
  const windowWidth = useWindowDimensions().width;
  const isLandscape = windowWidth >= LayoutSize.md;
  return (
    <View style={styles.root}>
      <View style={styles.inner}>
        {isLandscape && <Sidebar />}
        {children}
      </View>
      <PlayerView />
      {!isLandscape && <BottomTabs />}
    </View>
  );
};

export default Layout;
