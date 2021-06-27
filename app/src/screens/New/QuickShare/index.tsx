import { ParamList, RouteName } from "@/screens/types";
import { HeaderBackable, Size } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Size[3],
    paddingBottom: 0,
    flex: 1,
  },
});

const QuickShare: FC<StackScreenProps<ParamList, RouteName.NewQuickShare>> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const title = t("new.quick_share.title");

  const onFinish = useCallback(
    (selectedTracks: string[]) => {
      navigation.navigate(RouteName.NewFinal, {
        selectedTracks,
        modeTitle: title,
      });
    },
    [navigation, title]
  );

  return (
    <SafeAreaView style={styles.root}>
      <HeaderBackable title={title} />
    </SafeAreaView>
  );
};

export default QuickShare;
