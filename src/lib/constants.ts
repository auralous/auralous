import { PlatformName, StoryMembership } from "~/graphql/gql.gen";
import { SvgYoutube, SvgSpotify } from "~/assets/svg/index";
import { Locale } from "~/i18n/types";

export const PLATFORM_FULLNAMES: Record<PlatformName, string> = {
  [PlatformName.Youtube]: "YouTube",
  [PlatformName.Spotify]: "Spotify",
};

export const CONFIG = {
  storyMaxAge: 4 * 60 * 60,
} as const;

export const MEMBERSHIP_NAMES: Record<StoryMembership | "", string> = {
  [StoryMembership.Collab]: "Collaborator",
  [StoryMembership.Host]: "Host",
  "": "Guest",
};

export const SvgByPlatformName: Record<
  PlatformName,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  [PlatformName.Youtube]: SvgYoutube,
  [PlatformName.Spotify]: SvgSpotify,
};

export const LANGUAGES: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};
