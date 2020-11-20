import { RoomState } from "~/graphql/gql.gen";

export type QueuePermission = Pick<
  RoomState["permission"],
  "queueCanAdd" | "queueCanManage"
>;

export interface QueueRules {
  [key: string]: string | number;
}
