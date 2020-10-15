export interface QueuePermission {
  canEditOthers: boolean;
  canAdd: boolean | number;
}

export interface QueueRules {
  [key: string]: string | number;
}
