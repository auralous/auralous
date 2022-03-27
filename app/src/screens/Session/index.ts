import { NullComponent } from "@/components/misc";
import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";
import { headerRight } from "./HeaderRight";

const SessionScreen = wrappedLazy(() => import("./SessionScreen"));

const SessionRouteConfig = {
  name: RouteName.Session,
  component: SessionScreen,
  options: {
    title: t("session.title"),
    headerTitle: NullComponent,
    headerTransparent: true,
    headerRight,
  },
};

export default SessionRouteConfig;
