import { PlatformName, RoomMembership } from "~/graphql/gql.gen";

export const PLATFORM_FULLNAMES: Record<PlatformName, string> = {
  [PlatformName.Spotify]: "Spotify",
  [PlatformName.Youtube]: "YouTube",
};

export const CONFIG = {
  roomMaxAge: 4 * 60 * 60,
} as const;

export const MEMBERSHIP_NAMES: Record<RoomMembership | "", string> = {
  [RoomMembership.Collab]: "Collaborator",
  [RoomMembership.Host]: "Host",
  "": "Guest",
};
