import {
  IconEdit,
  IconHeadphones,
  IconPlayListAdd,
  IconSettings,
  IconShare2,
  IconX,
} from "@/assets";
import imageDefaultPlaylist from "@/assets/images/default_playlist.jpg";
import imageDefaultTrack from "@/assets/images/default_track.jpg";
import imageDefaultUser from "@/assets/images/default_user.jpg";
import { Config } from "@/config";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { isTruthy } from "@/utils/utils";
import type { Playlist, Session, Track, User } from "@auralous/api";
import { t } from "i18next";

export const ContextMenuValue = {
  user(uiDispatch: any, navigation: any, u: User, isCurrentUser?: boolean) {
    return {
      visible: true,
      title: u.username,
      image: u.profilePicture || imageDefaultUser,
      items: [
        {
          icon: <IconShare2 stroke={Colors.textSecondary} />,
          text: t("share.share"),
          onPress() {
            uiDispatch({
              type: "share",
              value: {
                visible: true,
                title: u.username,
                url: `${Config.APP_URI}/u/${u.username}`,
              },
            });
          },
        },
        isCurrentUser && {
          icon: <IconSettings stroke={Colors.textSecondary} />,
          text: t("settings.title"),
          onPress() {
            navigation.navigate(RouteName.Settings);
          },
        },
      ].filter(isTruthy),
    };
  },
  playlist(uiDispatch: any, playlist: Playlist) {
    return {
      visible: true,
      title: playlist.name,
      subtitle: playlist.creatorName,
      image: playlist.image || undefined,
      items: [
        {
          icon: <IconShare2 stroke={Colors.textSecondary} />,
          text: t("share.share"),
          onPress() {
            uiDispatch({
              type: "share",
              value: {
                visible: true,
                title: playlist.name,
                url: `${Config.APP_URI}/playlist/${playlist.id}`,
              },
            });
          },
        },
      ],
    };
  },
  session(
    uiDispatch: any,
    navigation: any,
    session: Session,
    isCreator: boolean
  ) {
    return {
      visible: true,
      title: session.text,
      subtitle: session.creator.username,
      image: session.image || imageDefaultPlaylist,
      items: [
        isCreator && {
          icon: <IconEdit stroke={Colors.textSecondary} />,
          text: t("session_edit.title"),
          onPress() {
            navigation.navigate(RouteName.SessionEdit, {
              id: session.id,
            });
          },
        },
        session.isLive && {
          icon: <IconHeadphones stroke={Colors.textSecondary} />,
          text: t("session_listeners.title"),
          onPress() {
            navigation.navigate(RouteName.SessionListeners, {
              id: session.id,
            });
          },
        },
        {
          icon: <IconShare2 stroke={Colors.textSecondary} />,
          text: t("share.share"),
          onPress() {
            uiDispatch({
              type: "share",
              value: {
                visible: true,
                title: session.text,
                url: `${Config.APP_URI}/session/${session.id}`,
              },
            });
          },
        },
        isCreator &&
          session.isLive && {
            icon: <IconX stroke={Colors.textSecondary} />,
            text: t("session_edit.live.end"),
            onPress() {
              navigation.navigate(RouteName.SessionEdit, {
                id: session.id,
                showEndModal: true,
              });
            },
          },
      ].filter(isTruthy),
    };
  },
  track(uiDispatch: any, track: Track) {
    return {
      visible: true,
      title: track.title,
      subtitle: track.artists.map((artist) => artist.name).join(", "),
      image: track.image || imageDefaultTrack,
      items: [
        {
          icon: <IconPlayListAdd color={Colors.textSecondary} />,
          text: t("playlist_adder.title"),
          onPress: () =>
            uiDispatch({
              type: "addToPlaylist",
              value: {
                visible: true,
                trackId: track.id,
              },
            }),
        },
      ],
    };
  },
};
