import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const NotificationsScreen = wrappedLazy(() => import("./NotificationScreen"));

const NotificationsRouteConfig = {
  name: RouteName.Notifications,
  component: NotificationsScreen,
  options: {
    title: t("notifications.title"),
  },
};

export default NotificationsRouteConfig;
