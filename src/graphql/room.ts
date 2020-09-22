import { FRAGMENT_USER_PUBLIC } from "./user";

export const FRAGMENT_ROOM_DETAIL = /* GraphQL */ `
  fragment RoomDetailParts on Room {
    title
    description
    image
    createdAt
  }
`;

export const FRAGMENT_ROOM_CREATOR = /* GraphQL */ `
  fragment RoomCreatorPart on Room {
    creator {
      ...UserPublicParts
    }
  }
  ${FRAGMENT_USER_PUBLIC}
`;

export const FRAGMENT_ROOM_RULES = /* GraphQL */ `
  fragment RoomRulesParts on RoomState {
    anyoneCanAdd
    collabs
    queueMax
  }
`;

export const QUERY_ROOM = /* GraphQL */ `
  query room($id: ID!) {
    room(id: $id) {
      id
      ...RoomDetailParts
      ...RoomCreatorPart
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
  ${FRAGMENT_ROOM_CREATOR}
`;

export const QUERY_ROOMS = /* GraphQL */ `
  query rooms($creatorId: String) {
    rooms(creatorId: $creatorId) {
      id
      ...RoomDetailParts
      ...RoomCreatorPart
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
  ${FRAGMENT_ROOM_CREATOR}
`;

export const QUERY_EXPLORE_ROOMS_BY = /* GraphQL */ `
  query exploreRooms($by: String!) {
    exploreRooms(by: $by) {
      id
      ...RoomDetailParts
      ...RoomCreatorPart
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
  ${FRAGMENT_ROOM_CREATOR}
`;

export const QUERY_SEARCH_ROOMS = /* GraphQL */ `
  query searchRooms($query: String!, $limit: Int) {
    searchRooms(query: $query, limit: $limit) {
      id
      ...RoomDetailParts
      ...RoomCreatorPart
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
  ${FRAGMENT_ROOM_CREATOR}
`;

export const MUTATION_CREATE_ROOM = /* GraphQL */ `
  mutation createRoom($title: String!, $description: String) {
    createRoom(title: $title, description: $description) {
      id
      ...RoomDetailParts
      ...RoomCreatorPart
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
  ${FRAGMENT_ROOM_CREATOR}
`;

export const MUTATION_UPDATE_ROOM = /* GraphQL */ `
  mutation updateRoom(
    $id: ID!
    $title: String
    $description: String
    $image: Upload
    $anyoneCanAdd: Boolean
    $queueMax: Int
  ) {
    updateRoom(
      id: $id
      title: $title
      description: $description
      image: $image
      anyoneCanAdd: $anyoneCanAdd
      queueMax: $queueMax
    ) {
      id
      ...RoomDetailParts
      ...RoomCreatorPart
    }
  }
  ${FRAGMENT_ROOM_DETAIL}
  ${FRAGMENT_ROOM_CREATOR}
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
    }
  }
  ${FRAGMENT_ROOM_RULES}
`;

export const SUBSCRIPTION_ROOM_STATE = /* GraphQL */ `
  subscription onRoomStateUpdated($id: ID!) {
    roomStateUpdated(id: $id) {
      id
      userIds
      ...RoomRulesParts
    }
  }
  ${FRAGMENT_ROOM_RULES}
`;
