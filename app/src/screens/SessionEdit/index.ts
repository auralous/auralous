import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SessionEditScreen = wrappedLazy(() => import("./SessionEditScreen"));

const SessionEditRouteConfig = {
  name: RouteName.SessionEdit,
  component: SessionEditScreen,
  options: {
    title: t("session_edit.title"),
  },
};

export default SessionEditRouteConfig;
