import { ImageSources } from "@/assets";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import { formatTime } from "@/utils";
import {
  Notification,
  NotificationFollow,
  NotificationNewStory,
} from "@auralous/api";
import { FC, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { Spacer } from "../Spacer";

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  hasRead: {
    opacity: 0.5,
  },
  image: {
    borderRadius: 9999,
    height: Size[12],
    width: Size[12],
  },
  notification: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[16],
    paddingHorizontal: Size[6],
  },
  timeDiff: {
    marginTop: Size[1],
  },
});

const NotificationTimeDiff: FC<{ notification: Notification }> = ({
  notification,
}) => {
  const { t } = useTranslation();
  const timeDiffText = useMemo(() => {
    const diff = Date.now() - notification.createdAt.getTime();
    if (diff < 60 * 1000) {
      return t("common.time.just_now");
    }
    return t("common.time.ago", { time: formatTime(t, diff) });
  }, [t, notification.createdAt]);
  return (
    <Text style={styles.timeDiff} color="textSecondary" size="sm">
      {timeDiffText}
    </Text>
  );
};

export const NotificationFollowItem: FC<{ notification: NotificationFollow }> =
  ({ notification }) => {
    const { t } = useTranslation();
    return (
      <View
        style={[styles.notification, notification.hasRead && styles.hasRead]}
      >
        <Image
          style={styles.image}
          source={
            notification.follower?.profilePicture
              ? { uri: notification.follower?.profilePicture }
              : ImageSources.defaultUser
          }
          defaultSource={ImageSources.defaultUser}
        />
        <Spacer x={2} />
        <View style={styles.content}>
          <Text>
            <Trans
              t={t}
              i18nKey="notifications.follow"
              components={[<Text key="name" bold />]}
              values={{
                username: notification.follower?.username,
              }}
            />
          </Text>
          <NotificationTimeDiff notification={notification} />
        </View>
      </View>
    );
  };

export const NotificationNewStoryItem: FC<{
  notification: NotificationNewStory;
}> = ({ notification }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.notification, notification.hasRead && styles.hasRead]}>
      <Image
        style={styles.image}
        source={
          notification.story?.creator.profilePicture
            ? { uri: notification.story?.creator.profilePicture }
            : ImageSources.defaultUser
        }
        defaultSource={ImageSources.defaultUser}
      />
      <Spacer x={2} />
      <View style={styles.content}>
        <Text>
          <Trans
            t={t}
            i18nKey="notifications.new_story"
            components={[<Text key="name" bold />]}
            values={{
              username: notification.story?.creator.username,
              story: notification.story?.text,
            }}
          />
        </Text>
        <NotificationTimeDiff notification={notification} />
      </View>
    </View>
  );
};
