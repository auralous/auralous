import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  left?: React.ReactNode;
  leftLabel?: string;
  onLeftPress?: () => void;
  right?: React.ReactNode;
  rightLabel?: string;
  onRightPress?: () => void;
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

const HeaderBase: React.FC<HeaderProps> = ({
  title,
  translucent,
  left,
  leftLabel,
  onLeftPress,
  right,
  rightLabel,
  onRightPress,
}) => {
  return (
    <>
      {!translucent && <View style={styles.height} />}
      <View style={styles.left}>
        {left && (
          <TouchableOpacity
            style={[styles.height, styles.button]}
            onPress={onLeftPress}
            accessibilityLabel={leftLabel}
          >
            {left}
          </TouchableOpacity>
        )}
      </View>
      <View pointerEvents="none" style={[styles.height, styles.title]}>
        <Text bold align="center" size="lg">
          {title}
        </Text>
      </View>
      <View style={styles.right}>
        {right && (
          <TouchableOpacity
            style={[styles.height, styles.button]}
            onPress={onRightPress}
            accessibilityLabel={rightLabel}
          >
            {right}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default HeaderBase;
