import type { PlaybackCurrentContext } from "@auralous/player";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import type { Dispatch, FC, ReactNode } from "react";
import { useReducer } from "react";

interface NavigablePages {
  home: undefined;
  map: undefined;
  user: { username: string };
  userFollowers: { username: string };
  userFollowing: { username: string };
  session: { id: string };
  sessionListeners: { id: string };
  sessionCollaborators: { id: string };
  playlist: { id: string };
}

interface UIState {
  playerView: { visible: boolean };
  addToPlaylist: { visible: boolean; trackId: null | string };
  signIn: { visible: boolean };
  contextMenu: {
    visible: boolean;
    meta: {
      image?: string;
      title: string;
      subtitle?: string;
      items: {
        icon: ReactNode;
        text: string;
        onPress?(): void;
      }[];
    } | null;
  };
  stopLiveOnPlay: {
    visible: boolean;
    intention: {
      sessionId: string;
      nextPlaybackContext: PlaybackCurrentContext;
    } | null;
  };
}

export interface UIContextValue {
  uiNavigate<K extends keyof NavigablePages>(
    page: K,
    params: NavigablePages[K]
  ): void;
  ui: UIState;
  uiDispatch: Dispatch<Action<keyof UIState>>;
}

type Action<T extends keyof UIState> = {
  type: T;
  value: Partial<UIState[T]>;
};

function reducer<T extends keyof UIState>(state: UIState, action: Action<T>) {
  return {
    ...state,
    [action.type]: action.value,
  };
}

const uiInitialValues: UIState = {
  playerView: { visible: false },
  addToPlaylist: { visible: false, trackId: null },
  contextMenu: { visible: false, meta: null },
  signIn: { visible: false },
  stopLiveOnPlay: { visible: false, intention: null },
};

const UIContext = createContext({ ui: uiInitialValues } as UIContextValue);

export const UIContextProvider: FC<{
  uiNavigate: UIContextValue["uiNavigate"];
}> = ({ children, uiNavigate }) => {
  const [ui, uiDispatch] = useReducer(reducer, uiInitialValues);

  return (
    <UIContext.Provider value={{ uiNavigate, ui, uiDispatch }}>
      {children}
    </UIContext.Provider>
  );
};

const uiNavigateSelector = (state: UIContextValue) => state.uiNavigate;
export const useUiNavigate = () =>
  useContextSelector(UIContext, uiNavigateSelector);

const uiDispatchSelector = (state: UIContextValue) => state.uiDispatch;
export const useUiDispatch = () =>
  useContextSelector(UIContext, uiDispatchSelector);

const uiSelector = (state: UIContextValue) => state.ui;
export const useUi = () => useContextSelector(UIContext, uiSelector);
