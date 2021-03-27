export type AddTracksCallbackFn = (
  cbTrack: string[]
) => boolean | Promise<boolean>;

export type RemoveTrackCallbackFn = (
  trackId: string
) => boolean | Promise<boolean>;
