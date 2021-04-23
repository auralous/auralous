import { PlatformName } from "@/gql/gql.gen";
import { IconSpotify, IconYoutube } from ".";

export const SvgByPlatformName: Record<
  PlatformName,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  [PlatformName.Youtube]: IconYoutube,
  [PlatformName.Spotify]: IconSpotify,
};
