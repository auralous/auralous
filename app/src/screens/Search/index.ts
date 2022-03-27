import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SearchScreen = wrappedLazy(() => import("./SearchScreen"));

const SearchRouteConfig = {
  name: RouteName.Search,
  component: SearchScreen,
  options: {
    title: t("search.title"),
  },
};

export default SearchRouteConfig;
