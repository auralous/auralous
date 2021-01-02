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
    }
  }
`;
