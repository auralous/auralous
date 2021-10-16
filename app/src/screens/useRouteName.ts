import { useNavigationState } from "@react-navigation/native";
import { RouteName } from "./types";

export const useRouteNames = () => {
  const topRoute = useNavigationState((state) => {
    if (!state) return { name: RouteName.Home, state: undefined };
    return state.routes[state.index || 0];
  });
  if (topRoute.state?.routes)
    return [
      topRoute.name,
      topRoute.state.routes[topRoute.state.index || 0].name,
    ];
  return [topRoute.name];
};
