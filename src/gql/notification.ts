export const QUERY_NOTIFICATIONS = /* GraphQL */ `
  query notifications($next: String, $limit: Int!) {
    notifications(next: $next, limit: $limit) {
      id
      createdAt
      hasRead
      ... on NotificationFollow {
        followerId
      }
      ... on NotificationInvite {
        storyId
        inviterId
      }
      ... on NotificationNewStory {
        storyId
        creatorId
      }
      __typename
    }
  }
`;

export const MUTATION_NOTIFICATIONS_MARK_READ = /* GraphQL */ `
  mutation notificationsMarkRead($ids: [ID!]!) {
    notificationsMarkRead(ids: $ids)
  }
`;

export const SUBSCRIPTION_NOTIFICATION_ADDED = /* GraphQL */ `
  subscription notificationAdded {
    notificationAdded {
      id
      createdAt
      hasRead
      ... on NotificationFollow {
        followerId
      }
      ... on NotificationInvite {
        storyId
        inviterId
      }
      ... on NotificationNewStory {
        storyId
        creatorId
      }
      __typename
    }
  }
`;
