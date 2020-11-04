import { Room, RoomMembership, RoomState } from "~/graphql/gql.gen";

export const getRole = (
  userId: string,
  room: Room,
  roomState: RoomState
): RoomMembership | undefined =>
  room.creatorId === userId
    ? RoomMembership.Host
    : roomState.collabs.includes(userId)
    ? RoomMembership.Collab
    : undefined;
