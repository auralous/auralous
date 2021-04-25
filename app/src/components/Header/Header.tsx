import { IconChevronLeft } from "@/assets/svg";
import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface HeaderProps {
  title: string;
  leftText?: string;
  onLeftPress?: () => void;
  translucent?: boolean;
}

const styles = StyleSheet.create({
  height: {
    height: Size[10],
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    zIndex: 1,
    minWidth: Size[10],
  },
  left: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  right: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  title: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Header: React.FC<HeaderProps> = ({
  title,
  leftText,
  onLeftPress,
  translucent,
}) => {
  const navigation = useNavigation();
  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <>
      {!translucent && <View style={styles.height} />}
      <View style={styles.left}>
        <TouchableOpacity
          style={[styles.height, styles.button]}
          onPress={onLeftPress || goBack}
          accessibilityLabel={t("common.navigation.go_back")}
        >
          <IconChevronLeft stroke={colors.text} height={27} width={27} />
          {leftText && <Text bold>{leftText}</Text>}
        </TouchableOpacity>
      </View>
      <View pointerEvents="none" style={[styles.height, styles.title]}>
        <Text bold>{title}</Text>
      </View>
    </>
  );
};

export default Header;
