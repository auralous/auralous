import type { Dispatch, SetStateAction } from "react";

export interface NewSelectSongsContentProps {
  onFinish(selectedTracks: string[]): void;
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}
