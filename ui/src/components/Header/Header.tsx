import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import type { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface HeaderProps {
  title: string | ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  translucent?: boolean;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: Size[10],
  },
  root: {
    flexDirection: "row",
    paddingHorizontal: Size[6],
    paddingVertical: Size[2],
    width: "100%",
  },
  title: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

const Header: FC<HeaderProps> = ({ title, left, right }) => {
  return (
    <View style={styles.root}>
      <View style={styles.button}>{left}</View>
      <View style={styles.title}>
        {typeof title === "string" ? (
          <Text bold align="center" size="lg" numberOfLines={1}>
            {title}
          </Text>
        ) : (
          title
        )}
      </View>
      <View style={styles.button}>{right}</View>
    </View>
  );
};

export default Header;
