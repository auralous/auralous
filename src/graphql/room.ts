export const FRAGMENT_ROOM_DETAIL = /* GraphQL */ `
  fragment RoomDetailParts on Room {
    title
    description
    image
    createdAt
    isPublic
    creatorId
  }
`;

export const FRAGMENT_ROOM_RULES = /* GraphQL */ `
  fragment RoomRulesParts on RoomState {
    anyoneCanAdd
    collabs
  }
`;

export const FRAGMENT_ROOM_PERMISSION = /* GraphQL */ `
  fragment RoomPermissionPart on RoomState {
    permission {
      queueCanAdd
      queueCanManage
      viewable
    }
  }
`;

export const QUERY_ROOM = /* GraphQL */ `
  query room($id: ID!) {
    room(id: $id) {
      id
      ...RoomDetailParts
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
`;

export const QUERY_ROOMS = /* GraphQL */ `
  query rooms($creatorId: String) {
    rooms(creatorId: $creatorId) {
      id
      ...RoomDetailParts
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
`;

export const QUERY_EXPLORE_ROOMS_BY = /* GraphQL */ `
  query exploreRooms($by: String!) {
    exploreRooms(by: $by) {
      id
      ...RoomDetailParts
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
`;

export const QUERY_SEARCH_ROOMS = /* GraphQL */ `
  query searchRooms($query: String!, $limit: Int) {
    searchRooms(query: $query, limit: $limit) {
      id
      ...RoomDetailParts
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
`;

export const MUTATION_CREATE_ROOM = /* GraphQL */ `
  mutation createRoom(
    $title: String!
    $description: String
    $isPublic: Boolean!
    $anyoneCanAdd: Boolean
    $password: String
  ) {
    createRoom(
      title: $title
      description: $description
      isPublic: $isPublic
      anyoneCanAdd: $anyoneCanAdd
      password: $password
    ) {
      id
      ...RoomDetailParts
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
`;

export const MUTATION_UPDATE_ROOM = /* GraphQL */ `
  mutation updateRoom(
    $id: ID!
    $title: String
    $description: String
    $image: Upload
    $anyoneCanAdd: Boolean
    $password: String
  ) {
    updateRoom(
      id: $id
      title: $title
      description: $description
      image: $image
      anyoneCanAdd: $anyoneCanAdd
      password: $password
    ) {
      id
      ...RoomDetailParts
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
`;

export const MUTATION_UPDATE_ROOM_MEMBERSHIP = /* GraphQL */ `
  mutation updateRoomMembership(
    $id: ID!
    $username: String
    $userId: String
    $role: RoomMembership
  ) {
    updateRoomMembership(
      id: $id
      username: $username
      userId: $userId
      role: $role
    )
  }
`;

export const MUTATION_JOIN_PRIVATE_ROOM = /* GraphQL */ `
  mutation joinPrivateRoom($id: ID!, $password: String!) {
    joinPrivateRoom(id: $id, password: $password)
  }
`;

export const MUTATION_DELETE_ROOM = /* GraphQL */ `
  mutation deleteRoom($id: ID!) {
    deleteRoom(id: $id)
  }
`;

export const QUERY_ROOM_STATE = /* GraphQL */ `
  query roomState($id: ID!) {
    roomState(id: $id) {
      id
      userIds
      ...RoomRulesParts
      ...RoomPermissionPart
    }
  }
  ${FRAGMENT_ROOM_RULES}
  ${FRAGMENT_ROOM_PERMISSION}
`;

export const MUTATION_PING_ROOM = /* GraphQL */ `
  mutation pingRoom($id: ID!) {
    pingRoom(id: $id)
  }
`;

export const SUBSCRIPTION_ROOM_STATE = /* GraphQL */ `
  subscription onRoomStateUpdated($id: ID!) {
    roomStateUpdated(id: $id) {
      id
      userIds
      ...RoomRulesParts
      ...RoomPermissionPart
    }
  }
  ${FRAGMENT_ROOM_RULES}
  ${FRAGMENT_ROOM_PERMISSION}
`;
