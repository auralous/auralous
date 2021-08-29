import { Colors } from "@/styles";
import type { FC } from "react";
import { ActivityIndicator } from "react-native";

const LoadingBlock: FC = () => {
  return <ActivityIndicator size="large" color={Colors.textSecondary} />;
};

export default LoadingBlock;
