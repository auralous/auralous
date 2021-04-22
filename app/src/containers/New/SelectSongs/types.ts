export interface TrackListProps {
  selectedTracks: string[];
  addTracks(trackIds: string[]): void;
  removeTrack(trackId: string): void;
}
