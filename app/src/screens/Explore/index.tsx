import { Container } from "@/components/Container";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "./components/AddButton";
import ExploreScreenContent from "./components/ExploreScreenContent";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Size[2],
  },
});

const ExploreScreen: FC<NativeStackScreenProps<ParamList, RouteName.Home>> =
  () => {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.scroll}>
          <Container>
            <ExploreScreenContent />
          </Container>
        </ScrollView>
        <AddButton />
      </SafeAreaView>
    );
  };

export default ExploreScreen;
