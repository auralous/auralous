import { Text } from "components/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

const SearchEmpty: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Text bold color="textSecondary" align="center">
        {t("common.result.search_empty")}
      </Text>
    </View>
  );
};

export default SearchEmpty;
