import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../Typography";
import TabsContext from "./Context";

const styles = StyleSheet.create({
  nonLast: {
    marginRight: Size[4],
  },
  tab: {
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    opacity: 0.6,
    padding: Size[1],
  },
  tabSelected: {
    borderBottomColor: Colors.primary,
    opacity: 1,
  },
});

const Tab: FC<{ index?: number; length?: number }> = ({
  index = 0,
  length = 0,
  children,
}) => {
  const { index: currentIndex, setIndex } = useContext(TabsContext);
  return (
    <TouchableOpacity
      accessibilityRole="tab"
      onPress={() => setIndex(index as number)}
      style={index < length - 1 ? styles.nonLast : undefined}
    >
      <Text
        style={[styles.tab, index === currentIndex && styles.tabSelected]}
        size="xl"
        bold
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Tab;
