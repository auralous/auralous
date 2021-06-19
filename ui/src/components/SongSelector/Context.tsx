import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

export type SongSelectorState =
  | {
      selectedTracks: string[];
    }
  | {
      selectedTracks: string[];
      addTracks(trackIds: string[]): void;
      removeTrack(trackId: string): void;
    };

export const SongSelectorContext = createContext({} as SongSelectorState);

const selectedTracksSelector = (v: SongSelectorState) => v.selectedTracks;
export const useSelectedTracks = () =>
  useContextSelector(SongSelectorContext, selectedTracksSelector);

const updateTracksSelector = (v: SongSelectorState) =>
  "addTracks" in v
    ? {
        addTracks: v.addTracks,
        removeTrack: v.removeTrack,
      }
    : undefined;
export const useUpdateTracks = () =>
  useContextSelector(SongSelectorContext, updateTracksSelector);
