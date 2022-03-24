import { createContext, useContext, useMemo } from "react";

export type SongSelectorState =
  | {
      selectedTracks: string[];
    }
  | {
      selectedTracks: string[];
      addTracks(trackIds: string[]): void;
      removeTracks(trackIds: string[]): void;
    };

export const SongSelectorContext = createContext({} as SongSelectorState);

export const useSelectedTracks = () =>
  useContext(SongSelectorContext).selectedTracks;

export const useUpdateTracks = () => {
  const ctx = useContext(SongSelectorContext);
  return useMemo(() => {
    return "addTracks" in ctx
      ? {
          addTracks: ctx.addTracks,
          removeTracks: ctx.removeTracks,
        }
      : undefined;
    // @ts-ignore
  }, [ctx.addTracks, ctx.removeTracks]);
};
