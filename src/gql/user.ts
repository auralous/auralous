const FRAGMENT_USER_PUBLIC = /* GraphQL */ `
  fragment UserPublicParts on User {
    id
    username
    bio
    profilePicture
  }
`;

export const QUERY_ME = /* GraphQL */ `
  query me {
    me {
      user {
        ...UserPublicParts
      }
      oauthId
      platform
      accessToken
      expiredAt
    }
  }
  ${FRAGMENT_USER_PUBLIC}
`;

export const QUERY_USER = /* GraphQL */ `
  query user($username: String, $id: ID) {
    user(username: $username, id: $id) {
      ...UserPublicParts
    }
  }
  ${FRAGMENT_USER_PUBLIC}
`;

export const QUERY_USER_STAT = /* GraphQL */ `
  query userStat($id: ID!) {
    userStat(id: $id) {
      id
      followerCount
      followingCount
    }
  }
`;

export const QUERY_USER_FOLLOWERS = /* GraphQL */ `
  query userFollowers($id: ID!) {
    userFollowers(id: $id)
  }
`;

export const QUERY_USER_FOLLOWINGs = /* GraphQL */ `
  query userFollowings($id: ID!) {
    userFollowings(id: $id)
  }
`;

export const MUTATION_FOLLOW_USER = /* GraphQL */ `
  mutation followUser($id: ID!) {
    followUser(id: $id)
  }
`;

export const MUTATION_UNFOLLOW_USER = /* GraphQL */ `
  mutation unfollowUser($id: ID!) {
    unfollowUser(id: $id)
  }
`;

export const MUTATION_UPDATE_CURRENT_USER = /* GraphQL */ `
  mutation updateMe($name: String, $username: String, $profilePicture: Upload) {
    me(name: $name, username: $username, profilePicture: $profilePicture) {
      ...UserPublicParts
    }
  }
  ${FRAGMENT_USER_PUBLIC}
`;

export const MUTATION_DELETE_CURRENT_USER = /* GraphQL */ `
  mutation deleteMe {
    deleteMe
  }
`;
