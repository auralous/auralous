import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SessionInviteScreen = wrappedLazy(() => import("./SessionInviteScreen"));

const SessionInviteRouteConfig = {
  name: RouteName.SessionInvite,
  component: SessionInviteScreen,
  options: {
    title: "",
  },
};

export default SessionInviteRouteConfig;
