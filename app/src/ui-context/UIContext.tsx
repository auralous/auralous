import type { BottomSheetActionMenuProps } from "@/components/BottomSheet";
import type { PlaybackSelection } from "@/player";
import type { Dispatch, FC } from "react";
import { createContext, useContext, useReducer } from "react";
import type { Omit } from "react-native";
import { TimeDiffFormatterProvider } from "./TimeDiffFormatter";

interface UIState {
  newSession: { visible: boolean };
  addToPlaylist: { visible: boolean; trackId: null | string };
  signIn: { visible: boolean };
  contextMenu: Omit<BottomSheetActionMenuProps, "onDismiss">;
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
export const UIContextProvider: FC = ({ children }) => {
  const uiReducer = useReducer(reducer, uiInitialValues);

  return (
    <UIContext.Provider value={uiReducer}>
      <TimeDiffFormatterProvider>{children}</TimeDiffFormatterProvider>
    </UIContext.Provider>
  );
};

export const useUIDispatch = () => useContext(UIContext)[1];
export const useUI = () => useContext(UIContext)[0];
