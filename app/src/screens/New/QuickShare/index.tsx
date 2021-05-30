import { HeaderBackable } from "@/components/Header";
import { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
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

const QuickShare: React.FC<
  StackScreenProps<ParamList, RouteName.NewQuickShare>
> = ({ navigation }) => {
  const { t } = useTranslation();

  const title = t("new.select_songs.title");

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
