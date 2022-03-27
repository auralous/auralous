import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const FeedScreen = wrappedLazy(() => import("./FeedScreen"));

const FeedRouteConfig = {
  name: RouteName.Feed,
  component: FeedScreen,
  options: {
    title: t("feed.title"),
  },
};

export default FeedRouteConfig;
