import React from "react";
import { ActivityIndicator } from "react-native";
import { useColors } from "styles";

const LoadingBlock: React.FC = () => {
  const colors = useColors();
  return <ActivityIndicator size="large" color={colors.textSecondary} />;
};

export default LoadingBlock;
