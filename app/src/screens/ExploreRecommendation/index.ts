import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const ExploreRecommendationScreen = wrappedLazy(
  () => import("./ExploreRecommendationScreen")
);

const ExploreRecommendationRouteConfig = {
  name: RouteName.ExploreRecommendation,
  component: ExploreRecommendationScreen,
  options: {
    title: t("explore.title"),
  },
};

export default ExploreRecommendationRouteConfig;
