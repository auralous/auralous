import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SessionListenersScreen = wrappedLazy(
  () => import("./SessionListenersScreen")
);

const SessionListenersRouteConfig = {
  name: RouteName.SessionListeners,
  component: SessionListenersScreen,
  options: {
    title: t("session_listeners.title"),
  },
};

export default SessionListenersRouteConfig;
