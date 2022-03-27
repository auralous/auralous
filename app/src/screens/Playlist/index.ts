import { NullComponent } from "@/components/misc";
import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";
import { headerRight } from "./HeaderRight";

const PlaylistScreen = wrappedLazy(() => import("./PlaylistScreen"));

const PlaylistRouteConfig = {
  name: RouteName.Playlist,
  component: PlaylistScreen,
  options: {
    title: t("playlist.title"),
    headerTitle: NullComponent,
    headerTransparent: true,
    headerRight: headerRight,
  },
};

export default PlaylistRouteConfig;
