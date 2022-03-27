import { NullComponent } from "@/components/misc";
import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";
import { headerRight } from "./HeaderRight";

const UserScreen = wrappedLazy(() => import("./UserScreen"));

const UserRouteConfig = {
  name: RouteName.User,
  component: UserScreen,
  options: {
    title: t("user.title"),
    headerTitle: NullComponent,
    headerRight,
  },
};

export default UserRouteConfig;
