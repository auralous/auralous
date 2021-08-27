import { Colors } from "@/styles";
import { FC } from "react";
import { ActivityIndicator } from "react-native";

const LoadingBlock: FC = () => {
  return <ActivityIndicator size="large" color={Colors.textSecondary} />;
};

export default LoadingBlock;
