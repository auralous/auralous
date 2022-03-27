import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SessionCollaboratorsScreen = wrappedLazy(
  () => import("./SessionCollaboratorsScreen")
);

const SessionCollaboratorsRouteConfig = {
  name: RouteName.SessionCollaborators,
  component: SessionCollaboratorsScreen,
  options: {
    title: t("collab.title"),
  },
};

export default SessionCollaboratorsRouteConfig;
