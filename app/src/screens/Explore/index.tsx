import { Container } from "@/components/Container";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
      <View style={styles.root}>
        <ScrollView style={styles.scroll}>
          <Container>
            <ExploreScreenContent />
          </Container>
        </ScrollView>
        <AddButton />
      </View>
    );
  };

export default ExploreScreen;
