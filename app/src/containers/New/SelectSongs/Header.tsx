import { IconChevronLeft } from "@/assets/svg";
import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: Size[10],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Size[2],
  },
  buttonContainer: {
    height: Size[10],
  },
  button: {
    paddingHorizontal: Size[2],
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

const Header: React.FC = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.goBack()}
        >
          <IconChevronLeft stroke={colors.text} height={27} width={27} />
          <Text bold>{t("common.navigation.go_back")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
