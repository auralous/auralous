import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const NewQuickShareScreen = wrappedLazy(() => import("./NewQuickShareScreen"));

const NewQuickShareRouteConfig = {
  name: RouteName.NewQuickShare,
  component: NewQuickShareScreen,
  options: {
    title: t("new.quick_share.title"),
  },
};

export default NewQuickShareRouteConfig;
