import { Story, StoryMembership, StoryState } from "~/graphql/gql.gen";

export const getRole = (
  userId: string,
  story: Story,
  storyState: StoryState
): StoryMembership | undefined =>
  story.creatorId === userId
    ? StoryMembership.Host
    : storyState.collabs.includes(userId)
    ? StoryMembership.Collab
    : undefined;
