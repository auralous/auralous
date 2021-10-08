import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import LoadingBlock from "./LoadingBlock";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

const LoadingScreen: FC = () => {
  return (
    <View style={styles.root}>
      <LoadingBlock />
    </View>
  );
};

export default LoadingScreen;
