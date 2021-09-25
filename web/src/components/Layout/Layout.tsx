import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import classNames from "./Layout.module.css";
import { Nav } from "./Nav";

const styles = StyleSheet.create({
  root: {
    height: "100%",
    position: "relative",
  },
});

export const Layout: FC = ({ children }) => {
  return (
    <View style={styles.root}>
      <Nav />
      <main className={classNames.main}>{children}</main>
    </View>
  );
};
