import { Size } from "@auralous/ui/styles";
import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface SpacerProps {
  x?: keyof typeof Size;
  y?: keyof typeof Size;
  style?: StyleProp<ViewStyle>;
}

const Spacer: FC<SpacerProps> = ({ x, y, style }) => {
  return (
    <View
      style={[
        {
          width: x ? Size[x] : 1,
          height: y ? Size[y] : 1,
        },
        style,
      ]}
    />
  );
};

export default Spacer;
