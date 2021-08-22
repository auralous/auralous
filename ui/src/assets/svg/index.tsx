import { Colors } from "@/styles";
import { FC, memo } from "react";
import { SvgProps } from "react-native-svg";
import IconArrowRightRaw from "./arrow-right.svg";
import IconBellRaw from "./bell.svg";
import IconCheckRaw from "./check.svg";
import IconChevronDownRaw from "./chevron-down.svg";
import IconChevronLeftRaw from "./chevron-left.svg";
import IconChevronUpRaw from "./chevron-up.svg";
import IconEditRaw from "./edit.svg";
import IconGoogleColorRaw from "./google-color.svg";
import IconHeadphonesRaw from "./headphones.svg";
import IconHomeRaw from "./home.svg";
import IconLogInRaw from "./log-in.svg";
import LogoRaw from "./logo.svg";
import IconMapPinRaw from "./map-pin.svg";
import IconMenuRaw from "./menu.svg";
import IconMessageSquareRaw from "./message-square.svg";
import IconMoreHorizontalRaw from "./more-horizontal.svg";
import IconMoreVerticalRaw from "./more-vertical.svg";
import IconMusicRaw from "./music.svg";
import IconPauseRaw from "./pause.svg";
import IconPlaylistAddRaw from "./play-list-add.svg";
import IconPlayRaw from "./play.svg";
import IconPlusRaw from "./plus.svg";
import IconSearchRaw from "./search.svg";
import IconSendRaw from "./send.svg";
import IconSettingsRaw from "./settings.svg";
import IconShare2Raw from "./share-2.svg";
import IconSkipBackRaw from "./skip-back.svg";
import IconSkipForwardRaw from "./skip-forward.svg";
import IconSpotifyRaw from "./spotify.svg";
import IconUserPlusRaw from "./user-plus.svg";
import IconUserRaw from "./user.svg";
import IconUsersRaw from "./users.svg";
import IconXRaw from "./x.svg";
import IconYoutubeRaw from "./youtube.svg";

const wrapIcon = (Icon: FC<SvgProps>) => {
  const WrappedIcon: FC<SvgProps> = (props: SvgProps) => (
    <Icon color={Colors.text} {...props} />
  );
  WrappedIcon.displayName = Icon.displayName;
  return memo(WrappedIcon);
};

export const IconBell = wrapIcon(IconBellRaw);
export const IconCheck = wrapIcon(IconCheckRaw);
export const IconChevronDown = wrapIcon(IconChevronDownRaw);
export const IconChevronLeft = wrapIcon(IconChevronLeftRaw);
export const IconChevronUp = wrapIcon(IconChevronUpRaw);
export const IconGoogleColor = wrapIcon(IconGoogleColorRaw);
export const IconHeadphones = wrapIcon(IconHeadphonesRaw);
export const IconHome = wrapIcon(IconHomeRaw);
export const IconLogIn = wrapIcon(IconLogInRaw);
export const Logo = wrapIcon(LogoRaw);
export const IconMapPin = wrapIcon(IconMapPinRaw);
export const IconMenu = wrapIcon(IconMenuRaw);
export const IconMessageSquare = wrapIcon(IconMessageSquareRaw);
export const IconMoreHorizontal = wrapIcon(IconMoreHorizontalRaw);
export const IconMoreVertical = wrapIcon(IconMoreVerticalRaw);
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
export const IconUsers = wrapIcon(IconUsersRaw);
export const IconUserPlus = wrapIcon(IconUserPlusRaw);
export const IconEdit = wrapIcon(IconEditRaw);
export const IconSettings = wrapIcon(IconSettingsRaw);
export const IconArrowRight = wrapIcon(IconArrowRightRaw);
export const IconShare2 = wrapIcon(IconShare2Raw);

export { IconByPlatformName } from "./PlatformIcon";
