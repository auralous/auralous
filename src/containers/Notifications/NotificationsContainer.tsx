import { Skeleton } from "components/Loading";
import { PageHeader } from "components/Page";
import { PressableHighlight } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  NotificationFollow,
  NotificationInvite,
  NotificationNewStory,
  NotificationsQuery,
  useNotificationAddedSubscription,
  useNotificationsQuery,
  useReadNotificationsMutation,
  useStoryQuery,
  useUserQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { t, useI18n } from "i18n/index";
import ms from "ms";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const getDateDiffTxt = (createdAt: Date) => {
  const dateDiff = Date.now() - createdAt.getTime();
  return dateDiff < 1000
    ? t("common.time.justNow")
    : `${ms(dateDiff, { long: true })} ${t("common.time.ago")}`;
};

const NotificationItemContent: React.FC<{
  loading?: boolean;
  notification: NotificationInvite | NotificationFollow | NotificationNewStory;
  content: JSX.Element;
  imageSrc: string;
  href?: string;
}> = ({ loading, notification, content, imageSrc, href }) => {
  const element = (
    <Box fullWidth row gap="sm" alignItems="center">
      <Skeleton rounded="full" show={loading} width={12} height={12}>
        <img src={imageSrc} alt="" className="w-12 h-12 rounded-full" />
      </Skeleton>
      <Box minWidth={0} flex={1} gap="xs">
        <Skeleton show={loading} width={40} height={6}>
          {content}
        </Skeleton>
        <Skeleton show={loading} width={20} height={4}>
          <Typography.Paragraph
            align="left"
            noMargin
            color="foreground-tertiary"
            size="xs"
          >
            {getDateDiffTxt(notification.createdAt)}
          </Typography.Paragraph>
        </Skeleton>
      </Box>
    </Box>
  );

  if (href)
    return (
      <Link href={href}>
        <PressableHighlight>{element}</PressableHighlight>
      </Link>
    );

  return (
    <Box padding={2} fullWidth>
      {element}
    </Box>
  );
};

const NotificationItemFollow: React.FC<{
  notification: NotificationFollow;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined }, fetching }] = useUserQuery({
    variables: { id: notification.followerId },
  });

  return (
    <NotificationItemContent
      loading={fetching}
      notification={notification}
      content={
        <Typography.Paragraph align="left" noMargin size="sm">
          <Typography.Text strong>{user?.username}</Typography.Text>{" "}
          {t("notification.follow.text")}
        </Typography.Paragraph>
      }
      imageSrc={user?.profilePicture || ""}
      href={`/user/${user?.username}`}
    />
  );
};

const NotificationItemInvite: React.FC<{
  notification: NotificationInvite;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [
    { data: { user } = { user: undefined }, fetching: fetchingUser },
  ] = useUserQuery({
    variables: { id: notification.inviterId },
  });

  const [
    { data: { story } = { story: undefined }, fetching: fetchingStory },
  ] = useStoryQuery({
    variables: { id: notification.storyId },
  });

  return (
    <NotificationItemContent
      loading={fetchingUser || fetchingStory}
      notification={notification}
      content={
        <Typography.Paragraph align="left" noMargin size="sm">
          <Typography.Text strong>{user?.username}</Typography.Text>{" "}
          {t("notification.invite.text")}{" "}
          <Typography.Text strong>
            {t("story.ofUsername", { username: user?.username })}
          </Typography.Text>
        </Typography.Paragraph>
      }
      href={`/story/${story?.id}`}
      imageSrc={story?.image || ""}
    />
  );
};

const NotificationItemNewStory: React.FC<{
  notification: NotificationNewStory;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [
    { data: { user } = { user: undefined }, fetching: fetchingUser },
  ] = useUserQuery({
    variables: { id: notification.creatorId },
  });

  const [
    { data: { story } = { story: undefined }, fetching: fetchingStory },
  ] = useStoryQuery({
    variables: { id: notification.storyId },
  });

  return (
    <NotificationItemContent
      loading={fetchingUser || fetchingStory}
      notification={notification}
      content={
        <Typography.Paragraph align="left" noMargin size="sm">
          <Typography.Text strong>{user?.username}</Typography.Text>{" "}
          {t("notification.newStory.text")}
        </Typography.Paragraph>
      }
      href={`/story/${story?.id}`}
      imageSrc={story?.image || ""}
    />
  );
};

const NotificationItem: React.FC<{
  notification: NotificationInvite | NotificationFollow | NotificationNewStory;
}> = ({ notification }) => {
  return (
    <Box paddingX={2} paddingY={1} rounded="lg">
      {notification.__typename === "NotificationInvite" ? (
        <NotificationItemInvite notification={notification} />
      ) : notification.__typename === "NotificationFollow" ? (
        <NotificationItemFollow notification={notification} />
      ) : (
        <NotificationItemNewStory notification={notification} />
      )}
    </Box>
  );
};

const NotificationsContainer: React.FC = () => {
  const { t } = useI18n();
  const dataRef = useRef<NotificationsQuery | undefined>();

  const [next, setNext] = useState<string | undefined>();

  const me = useMe();

  // FIXME: investigate an edge case where urql corrupts
  // data on pagination
  const [{ data }, fetchNotifications] = useNotificationsQuery({
    variables: { limit: 10, next },
    requestPolicy: "cache-and-network",
    pause: !me,
  });

  useNotificationAddedSubscription({ pause: !me }, (prev, subData) => {
    if (next !== undefined) setNext(undefined);
    else fetchNotifications();
    return subData;
  });

  const [, markRead] = useReadNotificationsMutation();

  useEffect(() => {
    // dataRef is used on unmount useEffect below
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    return () => {
      const readIds = dataRef.current?.notifications
        .filter((notification) => notification.hasRead === false)
        .map((notification) => notification.id);
      // mark all notifications as read
      if (readIds?.length) markRead({ ids: readIds });
    };
  }, [markRead]);

  // Watch if user scroll to the end in which case
  // we try to fetch more notifications
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && data?.notifications.length)
      setNext(data.notifications[data.notifications.length - 1].id);
  }, [inView, data]);

  return (
    <>
      <PageHeader name={t("notification.title")} />
      <Box paddingX={4}>
        {data?.notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        <div ref={ref} className="w-1 h-1" />
      </Box>
      <Spacer axis="vertical" size={12} />
    </>
  );
};

export default NotificationsContainer;
