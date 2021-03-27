import { SvgSpotify, SvgYoutube } from "assets/svg/index";
import { PlatformName } from "gql/gql.gen";
import { Locale } from "i18n/types";

export const PLATFORM_FULLNAMES: Record<PlatformName, string> = {
  [PlatformName.Youtube]: "YouTube",
  [PlatformName.Spotify]: "Spotify",
};

export const CONFIG = {
  storyMaxAge: 4 * 60 * 60,
  userMaxAge: 4 * 60 * 60,
  usernameMaxLength: 15,
  storyTextMaxLength: 60,
} as const;

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
