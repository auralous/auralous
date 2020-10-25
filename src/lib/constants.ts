import { PlatformName, RoomMembership } from "~/graphql/gql.gen";
import { SvgYoutube, SvgSpotify } from "~/assets/svg/index";

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

export const SvgByPlatformName: Record<
  PlatformName,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  [PlatformName.Youtube]: SvgYoutube,
  [PlatformName.Spotify]: SvgSpotify,
};
