import type { ParamList, RouteName } from "@/screens/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { NotificationsScreenContent } from "./NotificationsScreenContent";

export const NotificationsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Notifications>
> = () => {
  return <NotificationsScreenContent />;
};
