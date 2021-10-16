import { LayoutSize } from "@/styles/spacing";
import type { FC } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Sidebar from "./Sidebar";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    flex: 1,
  },
});

const Layout: FC = ({ children }) => {
  const windowWidth = useWindowDimensions().width;
  const isLandscape = windowWidth >= LayoutSize.md;
  return (
    <View style={styles.root}>
      {isLandscape && <Sidebar />}
      {children}
    </View>
  );
};

export default Layout;
