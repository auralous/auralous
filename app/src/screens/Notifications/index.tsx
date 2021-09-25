import type { ParamList, RouteName } from "@/screens/types";
import { NotificationsScreenContent } from "@auralous/ui";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";

export const NotificationsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Notifications>
> = () => {
  return <NotificationsScreenContent />;
};
