import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const UserFollowersScreen = wrappedLazy(() => import("./UserFollowersScreen"));

const UserFollowersRouteConfig = {
  name: RouteName.UserFollowers,
  component: UserFollowersScreen,
  options: {
    title: t("user.followers"),
  },
};

export default UserFollowersRouteConfig;
