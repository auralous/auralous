import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SessionsScreen = wrappedLazy(() => import("./SessionsScreen"));

const SessionsRouteConfig = {
  name: RouteName.Sessions,
  component: SessionsScreen,
  options: {
    title: t("explore.recent_sessions.title"),
  },
};

export default SessionsRouteConfig;
