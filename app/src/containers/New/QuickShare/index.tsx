import { HeaderBackable } from "@/components/Header";
import { Size } from "@/styles";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamListNew } from "../types";

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
  StackScreenProps<RootStackParamListNew, "new/select-songs">
> = ({ navigation }) => {
  const { t } = useTranslation();

  const title = t("new.select_songs.title");

  const onFinish = useCallback(
    (selectedTracks: string[]) => {
      navigation.navigate("new/final", {
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
