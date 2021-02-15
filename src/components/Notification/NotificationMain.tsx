import { Typography } from "components/Typography";
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
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const getDateDiffTxt = (createdAt: Date) => {
  const dateDiff = Date.now() - createdAt.getTime();
  return dateDiff < 1000
    ? t("common.time.justNow")
    : `${ms(dateDiff, { long: true })} ${t("common.time.ago")}`;
};

const NotificationItemStorySection: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();

  const [{ data: { story } = { story: undefined } }] = useStoryQuery({
    variables: { id },
  });

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story?.creatorId || "" },
    pause: !story,
  });

  return (
    <Link href={`/story/${id}`}>
      <a className="inline-flex p-2 my-1 rounded bg-background-tertiary text-inline-link">
        <img
          src={story?.image}
          alt={story?.text}
          className="w-8 h-8 rounded-sm object-cover"
        />
        <div className="px-2">
          <Typography.Paragraph size="sm" strong paragraph={false}>
            {t("story.ofUsername", { username: user?.username })}
          </Typography.Paragraph>
          <Typography.Paragraph size="xs" paragraph={false}>
            {story?.text}
          </Typography.Paragraph>
        </div>
      </a>
    </Link>
  );
};

const NotificationItemFollow: React.FC<{
  notification: NotificationFollow;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: notification.followerId },
  });

  return (
    <>
      <Typography.Paragraph paragraph={false} size="sm">
        <Link href={`/user/${user?.username}`}>
          <Typography.Link strong>{user?.username}</Typography.Link>
        </Link>{" "}
        {t("notification.follow.text")}
      </Typography.Paragraph>
    </>
  );
};

const NotificationItemInvite: React.FC<{
  notification: NotificationInvite;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: notification.inviterId },
  });

  return (
    <>
      <Typography.Paragraph paragraph={false} size="sm">
        <Link href={`/user/${user?.username}`}>
          <Typography.Link strong>{user?.username}</Typography.Link>
        </Link>{" "}
        {t("notification.invite.text")}
      </Typography.Paragraph>
      <NotificationItemStorySection id={notification.storyId} />
    </>
  );
};

const NotificationItemNewStory: React.FC<{
  notification: NotificationNewStory;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: notification.creatorId },
  });

  return (
    <>
      <Typography.Paragraph paragraph={false} size="sm">
        <Link href={`/user/${user?.username}`}>
          <Typography.Link strong>{user?.username}</Typography.Link>
        </Link>{" "}
        {t("notification.newStory.text")}
      </Typography.Paragraph>
      <NotificationItemStorySection id={notification.storyId} />
    </>
  );
};

const NotificationItem: React.FC<{
  notification: NotificationInvite | NotificationFollow | NotificationNewStory;
}> = ({ notification }) => {
  return (
    <div
      className={`px-4 py-2 bg-background-secondary border-l-4 ${
        notification.hasRead
          ? "border-background-tertiary opacity-75"
          : "border-primary"
      }`}
    >
      {notification.__typename === "NotificationInvite" ? (
        <NotificationItemInvite notification={notification} />
      ) : notification.__typename === "NotificationFollow" ? (
        <NotificationItemFollow notification={notification} />
      ) : (
        <NotificationItemNewStory notification={notification} />
      )}
      <div className="text-foreground-tertiary text-xs">
        {getDateDiffTxt(notification.createdAt)}
      </div>
    </div>
  );
};

const NotificationMain: React.FC = () => {
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
      <h1 className="page-title">{t("notification.title")}</h1>
      <div className="px-4 space-y-2">
        {data?.notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        <div ref={ref} className="w-1 h-1" />
      </div>
    </>
  );
};

export default NotificationMain;
