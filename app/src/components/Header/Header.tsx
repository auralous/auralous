import { useNavigation } from "@react-navigation/core";
import { ChevronLeft } from "assets/svg";
import { Text } from "components/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Size, useColors } from "styles";

interface HeaderProps {
  title: string;
}

const styles = StyleSheet.create({
  height: {
    height: Size[10],
  },
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    width: Size[10],
    height: Size[10],
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.height} />
      <View style={[styles.root, styles.height]}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => navigation.goBack()}
              accessibilityLabel={t("common.navigation.go_back")}
            >
              <ChevronLeft stroke={colors.text} height={27} width={27} />
            </TouchableOpacity>
          </View>
          <Text bold>{title}</Text>
          <View style={styles.buttonContainer} />
        </View>
      </View>
    </>
  );
};

export default Header;
