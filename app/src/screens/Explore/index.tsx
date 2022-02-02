import { IconPlusSquare } from "@/assets";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import ExploreScreenContent from "./components/index";

const styles = StyleSheet.create({
  add: {
    paddingHorizontal: Size[2],
  },
  root: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Size[2],
  },
});

const HeaderRight: FC = () => {
  const { t } = useTranslation();
  const uiDispatch = useUiDispatch();

  return (
    <Button
      variant="text"
      icon={<IconPlusSquare />}
      accessibilityLabel={t("new.title")}
      onPress={() =>
        uiDispatch({ type: "newSession", value: { visible: true } })
      }
      style={styles.add}
    />
  );
};

const ExploreScreen: FC<BottomTabScreenProps<ParamList, RouteName.Explore>> = ({
  navigation,
}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingHorizontal: Size[2],
      },
      headerRight() {
        return <HeaderRight />;
      },
    });
  }, [navigation]);

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
