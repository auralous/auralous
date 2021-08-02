import { ParamList, RouteName } from "@/screens/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MapScreen: FC<NativeStackScreenProps<ParamList, RouteName.Map>> = () => {
  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
};

export default MapScreen;
