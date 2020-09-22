export interface QueuePermission {
  canEditOthers: boolean;
  canAdd: boolean | number;
}

export interface QueueRules {
  maxSongs: number;
}
