import { useColors } from "@/styles";
import { FC, memo } from "react";
import { SvgProps } from "react-native-svg";
import IconCheckRaw from "./check.svg";
import IconChevronDownRaw from "./chevron-down.svg";
import IconChevronLeftRaw from "./chevron-left.svg";
import IconChevronUpRaw from "./chevron-up.svg";
import IconEditRaw from "./edit.svg";
import IconGoogleColorRaw from "./google-color.svg";
import IconHomeRaw from "./home.svg";
import IconLogInRaw from "./log-in.svg";
import LogoRaw from "./logo.svg";
import IconMapPinRaw from "./map-pin.svg";
import IconMenuRaw from "./menu.svg";
import IconMessageSquareRaw from "./message-square.svg";
import IconMoreHorizontalRaw from "./more-horizontal.svg";
import IconMusicRaw from "./music.svg";
import IconPauseRaw from "./pause.svg";
import IconPlaylistAddRaw from "./play-list-add.svg";
import IconPlayRaw from "./play.svg";
import IconPlusRaw from "./plus.svg";
import IconSearchRaw from "./search.svg";
import IconSendRaw from "./send.svg";
import IconSkipBackRaw from "./skip-back.svg";
import IconSkipForwardRaw from "./skip-forward.svg";
import IconSpotifyRaw from "./spotify.svg";
import IconUserPlusRaw from "./user-plus.svg";
import IconUserRaw from "./user.svg";
import IconXRaw from "./x.svg";
import IconYoutubeRaw from "./youtube.svg";

const wrapIcon = (Icon: FC<SvgProps>) => {
  const WrappedIcon: FC<SvgProps> = (props: SvgProps) => {
    const colors = useColors();
    return <Icon color={colors.text} {...props} />;
  };
  WrappedIcon.displayName = Icon.displayName;
  return memo(WrappedIcon);
};

export const IconCheck = wrapIcon(IconCheckRaw);
export const IconChevronDown = wrapIcon(IconChevronDownRaw);
export const IconChevronLeft = wrapIcon(IconChevronLeftRaw);
export const IconChevronUp = wrapIcon(IconChevronUpRaw);
export const IconGoogleColor = wrapIcon(IconGoogleColorRaw);
export const IconHome = wrapIcon(IconHomeRaw);
export const IconLogIn = wrapIcon(IconLogInRaw);
export const Logo = wrapIcon(LogoRaw);
export const IconMapPin = wrapIcon(IconMapPinRaw);
export const IconMenu = wrapIcon(IconMenuRaw);
export const IconMessageSquare = wrapIcon(IconMessageSquareRaw);
export const IconMoreHorizontal = wrapIcon(IconMoreHorizontalRaw);
export const IconMusic = wrapIcon(IconMusicRaw);
export const IconPause = wrapIcon(IconPauseRaw);
export const IconPlaylistAdd = wrapIcon(IconPlaylistAddRaw);
export const IconPlay = wrapIcon(IconPlayRaw);
export const IconPlus = wrapIcon(IconPlusRaw);
export const IconSearch = wrapIcon(IconSearchRaw);
export const IconSend = wrapIcon(IconSendRaw);
export const IconSkipBack = wrapIcon(IconSkipBackRaw);
export const IconSkipForward = wrapIcon(IconSkipForwardRaw);
export const IconSpotify = wrapIcon(IconSpotifyRaw);
export const IconX = wrapIcon(IconXRaw);
export const IconYoutube = wrapIcon(IconYoutubeRaw);
export const IconUser = wrapIcon(IconUserRaw);
export const IconUserPlus = wrapIcon(IconUserPlusRaw);
export const IconEdit = wrapIcon(IconEditRaw);
