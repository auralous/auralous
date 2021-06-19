import { PlatformName } from "@auralous/api";
import { IconSpotify, IconYoutube } from ".";

export const SvgByPlatformName: Record<
  PlatformName,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  [PlatformName.Youtube]: IconYoutube,
  [PlatformName.Spotify]: IconSpotify,
};
