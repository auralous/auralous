import { Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    padding: Size[4],
  },
});

const SearchEmpty: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Text color="textSecondary" align="center">
        {t("common.result.search_empty")}
      </Text>
    </View>
  );
};

export default SearchEmpty;
