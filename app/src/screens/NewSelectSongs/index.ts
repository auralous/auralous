import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const NewSelectSongsScreen = wrappedLazy(
  () => import("./NewSelectSongsScreen")
);

const NewSelectSongsRouteConfig = {
  name: RouteName.NewSelectSongs,
  component: NewSelectSongsScreen,
  options: {
    title: t("new.select_songs.title"),
  },
};

export default NewSelectSongsRouteConfig;
