import type { Emitter } from "mitt";
import { createContext, useContext } from "react";

export type SongSelectorState = {
  selectedTracks: string[];
  addTracks(trackIds: string[]): void;
  removeTracks(trackIds: string[]): void;
};

export interface SongSelectorRef {
  emitter: Emitter<any>;
  has(trackId: string): boolean;
  add: (trackIds: string[]) => void;
  remove: (trackIds: string[]) => void;
}

export const SongSelectorContext = createContext({} as SongSelectorRef);

export const useSongSelectorContext = () => useContext(SongSelectorContext);
