import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import EmptyBlock from "./EmptyBlock";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: Size[8],
    width: "100%",
  },
});

const ResultEmptyScreen: FC = () => {
  return (
    <View style={styles.root}>
      <EmptyBlock />
    </View>
  );
};

export default ResultEmptyScreen;
