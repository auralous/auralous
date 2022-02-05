import type { PlaybackCurrentContext } from "@/player";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import type { Dispatch, FC, ReactNode } from "react";
import { useMemo, useReducer } from "react";
import { use6432Layout } from "./layout";

interface UIState {
  newSession: { visible: boolean };
  addToPlaylist: { visible: boolean; trackId: null | string };
  signIn: { visible: boolean };
  contextMenu: {
    visible: boolean;
    image?: string;
    title: string;
    subtitle?: string;
    items: {
      icon: ReactNode;
      text: string;
      onPress?(): void;
    }[];
  };
  stopLiveOnPlay: {
    visible: boolean;
    intention: {
      sessionId: string;
      nextPlaybackContext: PlaybackCurrentContext | undefined;
    } | null;
  };
  share: {
    visible: boolean;
    title?: string;
    url?: string;
  };
}

export interface UIContextValue {
  ui: [UIState, Dispatch<Action<keyof UIState>>];
  layout: {
    column6432: number;
  };
}

type Action<T extends keyof UIState> = {
  type: T;
  value: Partial<UIState[T]>;
};

function reducer<T extends keyof UIState>(state: UIState, action: Action<T>) {
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      ...action.value,
    },
  };
}

const uiInitialValues: UIState = {
  newSession: { visible: false },
  addToPlaylist: { visible: false, trackId: null },
  contextMenu: { visible: false, items: [], title: "" },
  signIn: { visible: false },
  stopLiveOnPlay: { visible: false, intention: null },
  share: { visible: false },
};

const UIContext = createContext({} as UIContextValue);

export const UIContextProvider: FC = ({ children }) => {
  const [uiState, uiDispatch] = useReducer(reducer, uiInitialValues);
  const column6432 = use6432Layout();
  const layout = useMemo<UIContextValue["layout"]>(
    () => ({ column6432 }),
    [column6432]
  );

  return (
    <UIContext.Provider value={{ ui: [uiState, uiDispatch], layout }}>
      {children}
    </UIContext.Provider>
  );
};

const uiDispatchSelector = (state: UIContextValue) => state.ui[1];
export const useUiDispatch = () =>
  useContextSelector(UIContext, uiDispatchSelector);

const uiSelector = (state: UIContextValue) => state.ui[0];
export const useUi = () => useContextSelector(UIContext, uiSelector);

const layoutSelector = (state: UIContextValue) => state.layout;
export const useUiLayout = () => useContextSelector(UIContext, layoutSelector);
