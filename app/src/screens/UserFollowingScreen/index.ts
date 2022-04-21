import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const UserFollowingScreen = wrappedLazy(() => import("./UserFollowingScreen"));

const UserFollowingRouteConfig = {
  name: RouteName.UserFollowing,
  component: UserFollowingScreen,
  options: {
    title: t("user.following"),
  },
};

export default UserFollowingRouteConfig;
