import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SettingsScreen = wrappedLazy(() => import("./SettingsScreen"));

const SettingsRouteConfig = {
  name: RouteName.Settings,
  component: SettingsScreen,
  options: {
    title: t("settings.title"),
  },
};

export default SettingsRouteConfig;
