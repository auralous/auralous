export const FRAGMENT_STORY_DETAIL = /* GraphQL */ `
  fragment StoryDetailParts on Story {
    title
    description
    image
    createdAt
    isPublic
    creatorId
  }
`;

export const FRAGMENT_STORY_RULES = /* GraphQL */ `
  fragment StoryRulesParts on StoryState {
    anyoneCanAdd
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
  mutation createStory(
    $title: String!
    $description: String
    $isPublic: Boolean!
    $anyoneCanAdd: Boolean
    $password: String
  ) {
    createStory(
      title: $title
      description: $description
      isPublic: $isPublic
      anyoneCanAdd: $anyoneCanAdd
      password: $password
    ) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const MUTATION_UPDATE_STORY = /* GraphQL */ `
  mutation updateStory(
    $id: ID!
    $title: String
    $description: String
    $image: Upload
    $anyoneCanAdd: Boolean
    $password: String
  ) {
    updateStory(
      id: $id
      title: $title
      description: $description
      image: $image
      anyoneCanAdd: $anyoneCanAdd
      password: $password
    ) {
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

export const MUTATION_JOIN_PRIVATE_STORY = /* GraphQL */ `
  mutation joinPrivateStory($id: ID!, $password: String!) {
    joinPrivateStory(id: $id, password: $password)
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
