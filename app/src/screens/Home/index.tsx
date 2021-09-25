import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "./components/AddButton";
import HomeHeader from "./components/HomeHeader";
import { HomeScreenContent } from "./components/HomeScreenContent";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Size[2],
  },
});

const HomeScreen: FC<NativeStackScreenProps<ParamList, RouteName.Home>> =
  () => {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.scroll}>
          <HomeHeader />
          <HomeScreenContent />
        </ScrollView>
        <AddButton />
      </SafeAreaView>
    );
  };

export default HomeScreen;
