import { Container } from "@/components/Container";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ExploreScreenContent from "./components/index";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Size[2],
  },
});

const ExploreScreen: FC<
  BottomTabScreenProps<ParamList, RouteName.Explore>
> = () => {
  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll}>
        <Container>
          <ExploreScreenContent />
        </Container>
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;
