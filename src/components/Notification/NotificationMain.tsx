import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import ms from "ms";
import {
  NotificationInvite,
  NotificationFollow,
  useNotificationsQuery,
  useUserQuery,
  useStoryQuery,
  NotificationsQuery,
  useReadNotificationsMutation,
  NotificationNewStory,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { useInView } from "react-intersection-observer";

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
          <p className="text-sm font-semibold leading-none">
            {t("story.ofUsername", { username: user?.username })}
          </p>
          <p className="text-xs">{story?.text}</p>
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
      <p className="text-sm">
        <Link href={`/user/${user?.username}`}>
          <a className="font-bold">{user?.username}</a>
        </Link>{" "}
        {t("notification.follow.text")}
      </p>
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
      <p className="text-sm">
        <Link href={`/user/${user?.username}`}>
          <a className="font-bold">{user?.username}</a>
        </Link>{" "}
        {t("notification.invite.text")}
      </p>
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
      <p className="text-sm">
        <Link href={`/user/${user?.username}`}>
          <a className="font-bold">{user?.username}</a>
        </Link>{" "}
        {t("notification.newStory.text")}
      </p>
      <NotificationItemStorySection id={notification.storyId} />
    </>
  );
};

const NotificationItem: React.FC<{
  notification: NotificationInvite | NotificationFollow | NotificationNewStory;
}> = ({ notification }) => {
  const { t } = useI18n();

  const dateStr = useMemo(() => {
    const msDate = ms(Date.now() - notification.createdAt.getTime(), {
      long: true,
    });
    return `${msDate} ${t("common.time.ago")}`;
  }, [notification, t]);

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
      <div className="text-foreground-tertiary text-xs">{dateStr}</div>
    </div>
  );
};

const NotificationMain: React.FC = () => {
  const { t } = useI18n();
  const dataRef = useRef<NotificationsQuery | undefined>();

  const [next, setNext] = useState<string | undefined>();

  // FIXME: investigate an edge case where urql corrupts
  // data on pagination
  const [{ data }] = useNotificationsQuery({
    variables: { limit: 12, next },
    requestPolicy: "cache-and-network",
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
    if (inView && data?.notifications)
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
