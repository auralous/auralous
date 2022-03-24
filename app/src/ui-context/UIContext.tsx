import type { PlaybackSelection } from "@/player";
import type { Dispatch, FC, ReactNode } from "react";
import { createContext, useContext, useMemo, useReducer } from "react";
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
      nextPlaybackSelection: PlaybackSelection | undefined;
    } | null;
  };
  share: {
    visible: boolean;
    title?: string;
    url?: string;
  };
}

export interface UILayoutValue {
  column6432: number;
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

const UIContext = createContext(
  undefined as unknown as [UIState, Dispatch<Action<keyof UIState>>]
);
const UILayoutContext = createContext({} as UILayoutValue);

export const UIContextProvider: FC = ({ children }) => {
  const uiReducer = useReducer(reducer, uiInitialValues);
  const column6432 = use6432Layout();
  const layout = useMemo<UILayoutValue>(() => ({ column6432 }), [column6432]);

  return (
    <UIContext.Provider value={uiReducer}>
      <UILayoutContext.Provider value={layout}>
        {children}
      </UILayoutContext.Provider>
    </UIContext.Provider>
  );
};

export const useUIDispatch = () => useContext(UIContext)[1];
export const useUI = () => useContext(UIContext)[0];

export const useUILayout = () => useContext(UILayoutContext);
