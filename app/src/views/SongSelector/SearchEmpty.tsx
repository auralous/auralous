import { IconSearch } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: Size[8],
    width: "100%",
  },
});

const SearchEmpty: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <IconSearch color={Colors.textSecondary} />
      <Spacer y={2} />
      <Text color="textSecondary" align="center">
        {t("common.result.search_empty")}
      </Text>
    </View>
  );
};

export default SearchEmpty;
