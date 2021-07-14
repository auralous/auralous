import { FC } from "react";
import { StyleSheet, View } from "react-native";
import LoadingBlock from "./LoadingBlock";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
