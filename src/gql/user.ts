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

export const MUTATION_USER_FOLLOW = /* GraphQL */ `
  mutation userFollow($id: ID!) {
    userFollow(id: $id)
  }
`;

export const MUTATION_USER_UNFOLLOW = /* GraphQL */ `
  mutation userUnfollow($id: ID!) {
    userUnfollow(id: $id)
  }
`;

export const MUTATION_ME_UPDATE = /* GraphQL */ `
  mutation meUpdate($name: String, $username: String) {
    me(name: $name, username: $username) {
      ...UserPublicParts
    }
  }
  ${FRAGMENT_USER_PUBLIC}
`;

export const MUTATION_ME_DELETE = /* GraphQL */ `
  mutation meDelete {
    meDelete
  }
`;
