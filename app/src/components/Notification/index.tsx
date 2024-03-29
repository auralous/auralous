import imageDefaultUser from "@/assets/images/default_user.jpg";
import { Image } from "@/components/Image";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import { useTimeDiffFormatter } from "@/ui-context";
import type {
  Notification,
  NotificationFollow,
  NotificationNewSession,
} from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

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
  const tdf = useTimeDiffFormatter();
  const timeDiffText = useMemo(
    () => tdf(notification.createdAt),
    [tdf, notification.createdAt]
  );
  return (
    <Text style={styles.timeDiff} color="textSecondary" size="sm">
      {timeDiffText}
    </Text>
  );
};

export const NotificationFollowItem: FC<{
  notification: NotificationFollow;
}> = ({ notification }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.notification, notification.hasRead && styles.hasRead]}>
      <Image
        style={styles.image}
        source={
          notification.follower?.profilePicture
            ? { uri: notification.follower?.profilePicture }
            : imageDefaultUser
        }
        defaultSource={imageDefaultUser}
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

export const NotificationNewSessionItem: FC<{
  notification: NotificationNewSession;
}> = ({ notification }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.notification, notification.hasRead && styles.hasRead]}>
      <Image
        style={styles.image}
        source={
          notification.session?.creator.profilePicture
            ? { uri: notification.session?.creator.profilePicture }
            : imageDefaultUser
        }
        defaultSource={imageDefaultUser}
      />
      <Spacer x={2} />
      <View style={styles.content}>
        <Text>
          <Trans
            t={t}
            i18nKey="notifications.new_session"
            components={[<Text key="name" bold />]}
            values={{
              username: notification.session?.creator.username,
              session: notification.session?.text,
            }}
          />
        </Text>
        <NotificationTimeDiff notification={notification} />
      </View>
    </View>
  );
};
