import { Colors } from "@/styles";
import { PlatformName } from "@auralous/api";
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";
import IconSpotify from "./spotify.svg";
import IconYoutube from "./youtube.svg";

export const IconByPlatformName: FC<
  { platformName: PlatformName; noColor?: boolean } & SvgProps
> = ({ platformName, noColor, ...props }) => {
  if (platformName === PlatformName.Youtube)
    return (
      <IconYoutube fill={noColor ? Colors.text : Colors.youtube} {...props} />
    );
  else
    return (
      <IconSpotify fill={noColor ? Colors.text : Colors.spotify} {...props} />
    );
};
