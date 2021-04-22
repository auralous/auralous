import { PlatformName } from "gql/gql.gen";
import { Spotify, Youtube } from ".";

export const SvgByPlatformName: Record<
  PlatformName,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  [PlatformName.Youtube]: Youtube,
  [PlatformName.Spotify]: Spotify,
};
