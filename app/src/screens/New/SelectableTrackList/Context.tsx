import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import React, { useCallback, useState } from "react";

type SelectableTrackListState =
  | {
      selectedTracks: string[];
    }
  | {
      selectedTracks: string[];
      setSelectedTracks: (selectedTracks: string[]) => void;
      addTracks(trackIds: string[]): void;
      removeTrack(trackId: string): void;
    };

export const SelectableTrackListContext = createContext(
  {} as SelectableTrackListState
);

const selectedTracksSelector = (v: SelectableTrackListState) =>
  v.selectedTracks;

export const useSelectedTracks = () =>
  useContextSelector(SelectableTrackListContext, selectedTracksSelector);

const updateTracksSelector = (v: SelectableTrackListState) =>
  "setSelectedTracks" in v
    ? {
        setSelectedTracks: v.setSelectedTracks,
        addTracks: v.addTracks,
        removeTrack: v.removeTrack,
      }
    : undefined;
export const useUpdateTracks = () =>
  useContextSelector(SelectableTrackListContext, updateTracksSelector);

export const SelectableTrackListProvider: React.FC<{ noChange?: boolean }> = ({
  children,
  noChange,
}) => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const addTracks = useCallback((trackIds: string[]) => {
    setSelectedTracks((prev) => [...prev, ...trackIds]);
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setSelectedTracks((prev) => prev.filter((t) => t !== trackId));
  }, []);

  return (
    <SelectableTrackListContext.Provider
      value={{
        selectedTracks,
        ...(!noChange && { setSelectedTracks, addTracks, removeTrack }),
      }}
    >
      {children}
    </SelectableTrackListContext.Provider>
  );
};
