import { IconHeadphones, IconSettings } from "@/assets";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Spacer } from "@/components/Spacer";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUIDispatch } from "@/ui-context";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import ExploreScreenContent from "./components/index";

const styles = StyleSheet.create({
  headerBtn: {
    height: Size[8],
    paddingHorizontal: Size[2],
  },
  headerBtns: {
    flexDirection: "row",
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
  const uiDispatch = useUIDispatch();
  const navigation = useNavigation();
  return (
    <View style={styles.headerBtns}>
      <Button
        onPress={() => navigation.navigate(RouteName.Settings)}
        style={styles.headerBtn}
        accessibilityLabel={t("settings.title")}
        icon={<IconSettings width={20} height={20} />}
      />
      <Spacer x={2} />
      <Button
        variant="primary"
        onPress={() =>
          uiDispatch({ type: "newSession", value: { visible: true } })
        }
        style={styles.headerBtn}
        accessibilityLabel={t("new.title")}
        icon={<IconHeadphones width={20} height={20} />}
      >
        {t("common.action.create")}
      </Button>
    </View>
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
