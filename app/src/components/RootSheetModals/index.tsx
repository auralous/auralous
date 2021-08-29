import type { BottomSheetActionMenuProps } from "@/components/BottomSheet";
import { BottomSheetActionMenu } from "@/components/BottomSheet";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import type { Dispatch, FC, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";
import type { AddToPlaylistContextValue } from "./AddToPlaylist";
import { AddToPlaylistSheet } from "./AddToPlaylist";

interface ContextValue {
  values: {
    addToPlaylist: AddToPlaylistContextValue;
    actionSheet: Omit<BottomSheetActionMenuProps, "onDismiss">;
  };
  setValues: {
    addToPlaylist: Dispatch<SetStateAction<AddToPlaylistContextValue>>;
    actionSheet: Dispatch<
      SetStateAction<Omit<BottomSheetActionMenuProps, "onDismiss">>
    >;
  };
}

const rootSheetModalsValueSelector = (state: ContextValue) => state.values;
const rootSheetModalsSetterSelector = (state: ContextValue) => state.setValues;

const Context = createContext({} as ContextValue);

const RootSheetModalsProvider: FC = ({ children }) => {
  const [addToPlaylistValue, setAddToPlaylistValue] =
    useState<AddToPlaylistContextValue>(null);
  const [actionSheetValue, setActionSheetValue] = useState<
    Omit<BottomSheetActionMenuProps, "onDismiss">
  >({
    items: [],
    title: "",
    visible: false,
  });

  const setValues = useMemo(
    () => ({
      addToPlaylist: setAddToPlaylistValue,
      actionSheet: setActionSheetValue,
    }),
    []
  );

  return (
    <Context.Provider
      value={{
        setValues,
        values: {
          addToPlaylist: addToPlaylistValue,
          actionSheet: actionSheetValue,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

const RootSheetModalsComponents: FC = () => {
  const rootSheetModalsValues = useContextSelector(
    Context,
    rootSheetModalsValueSelector
  );
  const rootSheetModalsSetter = useRootSheetModalsSetter();

  const onDismissBottomSheetActionMenu = useCallback(
    () =>
      rootSheetModalsSetter.actionSheet((prevProps) => ({
        ...prevProps,
        visible: false,
      })),
    [rootSheetModalsSetter]
  );

  return (
    <>
      <AddToPlaylistSheet
        value={rootSheetModalsValues.addToPlaylist}
        setValue={rootSheetModalsSetter.addToPlaylist}
      />
      <BottomSheetActionMenu
        onDismiss={onDismissBottomSheetActionMenu}
        {...rootSheetModalsValues.actionSheet}
      />
    </>
  );
};

export const RootSheetModals = {
  Provider: RootSheetModalsProvider,
  Components: RootSheetModalsComponents,
};

export const useRootSheetModalsSetter = () =>
  useContextSelector(Context, rootSheetModalsSetterSelector);
