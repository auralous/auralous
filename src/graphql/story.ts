export const FRAGMENT_STORY_DETAIL = /* GraphQL */ `
  fragment StoryDetailParts on Story {
    text
    image
    createdAt
    isPublic
    isLive
    creatorId
    queueable
  }
`;

export const QUERY_STORY = /* GraphQL */ `
  query story($id: ID!) {
    story(id: $id) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_STORIES = /* GraphQL */ `
  query stories($id: ID!, $next: String, $limit: Int!) {
    stories(id: $id, next: $next, limit: $limit) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_STORY_LIVE = /* GraphQL */ `
  query storyLive($creatorId: String) {
    storyLive(creatorId: $creatorId) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const MUTATION_CREATE_STORY = /* GraphQL */ `
  mutation createStory($text: String!, $isPublic: Boolean!) {
    createStory(text: $text, isPublic: $isPublic) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const MUTATION_CHANGE_STORY_QUEUEABLE = /* GraphQL */ `
  mutation changeStoryQueueable(
    $id: ID!
    $userId: String!
    $isRemoving: Boolean!
  ) {
    changeStoryQueueable(id: $id, userId: $userId, isRemoving: $isRemoving)
  }
`;

export const MUTATION_DELETE_STORY = /* GraphQL */ `
  mutation deleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`;

export const MUTATION_UNLIVE_STORY = /* GraphQL */ `
  mutation unliveStory($id: ID!) {
    unliveStory(id: $id)
  }
`;

export const QUERY_STORY_USERS = /* GraphQL */ `
  query storyUsers($id: ID!) {
    storyUsers(id: $id)
  }
`;

export const MUTATION_PING_STORY = /* GraphQL */ `
  mutation pingStory($id: ID!) {
    pingStory(id: $id)
  }
`;

export const SUBSCRIPTION_STORY = /* GraphQL */ `
  subscription storyUpdated($id: ID!) {
    storyUpdated(id: $id) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const SUBSCRIPTION_STORY_USERS = /* GraphQL */ `
  subscription onStoryUsersUpdated($id: ID!) {
    storyUsersUpdated(id: $id)
  }
`;
