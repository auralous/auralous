export interface SelectableTrackListProps {
  selectedTracks: string[];
  addTracks?(trackIds: string[]): void;
  removeTrack?(trackId: string): void;
}
