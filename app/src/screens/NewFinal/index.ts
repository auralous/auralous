import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const NewFinalScreen = wrappedLazy(() => import("./NewFinalScreen"));

const NewFinalRouteConfig = {
  name: RouteName.NewFinal,
  component: NewFinalScreen,
  options: {
    animation: "fade" as const,
    headerShown: false,
    title: t("new.final.title"),
  },
};

export default NewFinalRouteConfig;
