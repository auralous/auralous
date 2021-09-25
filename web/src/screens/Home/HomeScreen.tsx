import { NavPlaceholder } from "@/components/Layout";
import { HomeScreenContent, Size } from "@auralous/ui";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RouteComponentProps } from "react-router";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Size[2],
  },
});

export const HomeScreen: FC<RouteComponentProps> = () => {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.scroll}>
        <NavPlaceholder />
        <HomeScreenContent />
      </ScrollView>
    </SafeAreaView>
  );
};
