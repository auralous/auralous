import { StoryState } from "~/graphql/gql.gen";

export type QueuePermission = Pick<StoryState["permission"], "isQueueable">;

export interface QueueRules {
  [key: string]: string | number;
}
