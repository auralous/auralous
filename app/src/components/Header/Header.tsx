import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HeaderProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  translucent?: boolean;
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: Size[2],
    paddingHorizontal: Size[6],
    flexDirection: "row",
    width: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minWidth: Size[10],
  },
  title: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const Header: React.FC<HeaderProps> = ({ title, left, right }) => {
  return (
    <View style={[styles.root]}>
      <View style={styles.button}>{left}</View>
      <View pointerEvents="none" style={styles.title}>
        <Text bold align="center" size="lg">
          {title}
        </Text>
      </View>
      <View style={styles.button}>{right}</View>
    </View>
  );
};

export default Header;
