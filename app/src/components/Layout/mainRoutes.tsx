import { IconBell, IconSearch, IconZap } from "@/assets";
import { RouteName } from "@/screens/types";

export const mainRoutes = [
  {
    name: RouteName.Explore,
    Icon: IconSearch,
    tTitle: "explore.title",
  },
  {
    name: RouteName.Feed,
    Icon: IconZap,
    tTitle: "feed.title",
  },
  {
    name: RouteName.Notifications,
    Icon: IconBell,
    tTitle: "notifications.title",
  },
];
