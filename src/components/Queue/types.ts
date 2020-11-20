export interface QueuePermission {
  canManage: boolean;
  canAdd: boolean | number;
}

export interface QueueRules {
  [key: string]: string | number;
}
