import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Size } from "styles";

interface SpacerProps {
  size: 1 | 2 | 4 | 8 | 12;
  axis?: "vertical" | "horizontal";
  style?: StyleProp<ViewStyle>;
}

const Spacer: React.FC<SpacerProps> = ({ size, axis, style }) => {
  return (
    <View
      style={[
        {
          width: axis !== "horizontal" ? Size[size] : 1,
          height: axis !== "vertical" ? Size[size] : 1,
        },
        style,
      ]}
    />
  );
};

export default Spacer;
