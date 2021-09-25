import { UIContextProvider } from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export const UIContextProviderWithRouter: FC = ({ children }) => {
  const history = useHistory();
  const uiNavigate = useCallback(
    // FIXME
    (page, params: any) => {
      switch (page) {
        case "home":
          return history.push("/");
        case "map":
          return history.push("/map");
        case "user":
          return history.push(`/user/${params.username}`);
        case "userFollowers":
          return history.push(`/user/${params.username}/followers`);
        case "userFollowing":
          return history.push(`/user/${params.username}/following`);
        case "session":
          return history.push(`/session/${params.id}`);
        case "sessionListeners":
          return history.push(`/session/${params.id}/listeners`);
        case "sessionCollaborators":
          return history.push(`/session/${params.id}/collaborators`);
        case "playlist":
          return history.push(`/playlist/${params.id}`);
      }
    },
    [history]
  );
  return (
    <UIContextProvider uiNavigate={uiNavigate}>{children}</UIContextProvider>
  );
};
