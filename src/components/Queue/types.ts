import { StoryState } from "~/graphql/gql.gen";

export type QueuePermission = Pick<
  StoryState["permission"],
  "queueCanAdd" | "queueCanManage"
>;

export interface QueueRules {
  [key: string]: string | number;
}
