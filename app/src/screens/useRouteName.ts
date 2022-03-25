import { useNavigationState } from "@react-navigation/native";
import { RouteName } from "./types";

export const useRouteNames = () => {
  const topRoute = useNavigationState((state) => {
    if (!state) return { name: RouteName.Explore, state: undefined };
    return state.routes[state.index || 0];
  });
  if (topRoute.state?.routes)
    return [
      topRoute.name,
      topRoute.state.routes[topRoute.state.index || 0].name,
    ] as RouteName[];
  return [topRoute.name] as RouteName[];
};

const fullscreenRoutes = [
  RouteName.NewFinal,
  RouteName.NewQuickShare,
  RouteName.NewSelectSongs,
];

export const useIsFullscreenRoute = () => {
  const routeNames = useRouteNames();
  const routeName = routeNames[routeNames.length - 1];

  return fullscreenRoutes.includes(routeName);
};
