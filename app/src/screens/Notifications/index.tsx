import type { ParamList, RouteName } from "@/screens/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { FC } from "react";
import { NotificationsScreenContent } from "./NotificationsScreenContent";

const NotificationsScreen: FC<
  BottomTabScreenProps<ParamList, RouteName.Notifications>
> = () => {
  return <NotificationsScreenContent />;
};

export default NotificationsScreen;
