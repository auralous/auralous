import type { FC, ReactElement } from "react";
import { Children, cloneElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
  },
});

const TabList: FC<{ style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
  const arrayChildren = Children.toArray(children) as ReactElement[];
  return (
    <View style={[styles.tabs, style]} accessibilityRole="tablist">
      {Children.map(arrayChildren, (child, index) =>
        cloneElement(child, { index, length: arrayChildren.length })
      )}
    </View>
  );
};

export default TabList;
