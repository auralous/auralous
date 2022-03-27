import { Size } from "@/styles/spacing";
import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";
import { headerRight } from "./HeaderRight";

const ExploreScreen = wrappedLazy(() => import("./ExploreScreen"));

const ExploreRouteConfig = {
  name: RouteName.Explore,
  component: ExploreScreen,
  options: {
    title: t("explore.title"),
    headerRight,
    headerRightContainerStyle: {
      paddingHorizontal: Size[2],
    },
  },
};

export default ExploreRouteConfig;
