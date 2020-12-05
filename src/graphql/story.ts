export const FRAGMENT_STORY_DETAIL = /* GraphQL */ `
  fragment StoryDetailParts on Story {
    text
    image
    createdAt
    isPublic
    creatorId
  }
`;

export const FRAGMENT_STORY_RULES = /* GraphQL */ `
  fragment StoryRulesParts on StoryState {
    collabs
  }
`;

export const FRAGMENT_STORY_PERMISSION = /* GraphQL */ `
  fragment StoryPermissionPart on StoryState {
    permission {
      queueCanAdd
      queueCanManage
      viewable
    }
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
  query stories($creatorId: String) {
    stories(creatorId: $creatorId) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_EXPLORE_STORIES_BY = /* GraphQL */ `
  query exploreStories($by: String!) {
    exploreStories(by: $by) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_SEARCH_STORIES = /* GraphQL */ `
  query searchStories($query: String!, $limit: Int) {
    searchStories(query: $query, limit: $limit) {
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

export const MUTATION_UPDATE_STORY_MEMBERSHIP = /* GraphQL */ `
  mutation updateStoryMembership(
    $id: ID!
    $username: String
    $userId: String
    $role: StoryMembership
  ) {
    updateStoryMembership(
      id: $id
      username: $username
      userId: $userId
      role: $role
    )
  }
`;

export const MUTATION_DELETE_STORY = /* GraphQL */ `
  mutation deleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`;

export const QUERY_STORY_STATE = /* GraphQL */ `
  query storyState($id: ID!) {
    storyState(id: $id) {
      id
      userIds
      ...StoryRulesParts
      ...StoryPermissionPart
    }
  }
  ${FRAGMENT_STORY_RULES}
  ${FRAGMENT_STORY_PERMISSION}
`;

export const MUTATION_PING_STORY = /* GraphQL */ `
  mutation pingStory($id: ID!) {
    pingStory(id: $id)
  }
`;

export const SUBSCRIPTION_STORY_STATE = /* GraphQL */ `
  subscription onStoryStateUpdated($id: ID!) {
    storyStateUpdated(id: $id) {
      id
      userIds
      ...StoryRulesParts
      ...StoryPermissionPart
    }
  }
  ${FRAGMENT_STORY_RULES}
  ${FRAGMENT_STORY_PERMISSION}
`;
