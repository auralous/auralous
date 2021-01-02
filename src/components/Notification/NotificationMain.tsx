import React, { useMemo } from "react";
import Link from "next/link";
import ms from "ms";
import {
  Notification,
  NotificationInvite,
  NotificationFollow,
  useNotificationsQuery,
  useUserQuery,
  useStoryQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const NotificationItemWrapper: React.FC<{
  notification: Notification;
}> = ({ notification, children }) => {
  const { t } = useI18n();

  const dateStr = useMemo(() => {
    const msDate = ms(Date.now() - notification.createdAt.getTime(), {
      long: true,
    });
    return `${msDate} ${t("common.time.ago")}`;
  }, [notification, t]);

  return (
    <div className="px-4 py-2 border-primary border-l-4 bg-background-secondary">
      {children}
      <div className="text-foreground-tertiary text-xs">{dateStr}</div>
    </div>
  );
};

const NotificationFollowItem: React.FC<{
  notification: NotificationFollow;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: notification.followerId },
  });

  return (
    <NotificationItemWrapper notification={notification}>
      <p className="text-sm">
        <Link href={`/user/${user?.username}`}>
          <a className="font-bold">{user?.username}</a>
        </Link>{" "}
        {t("notification.follow.text")}
      </p>
    </NotificationItemWrapper>
  );
};

const NotificationInviteItem: React.FC<{
  notification: NotificationInvite;
}> = ({ notification }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: notification.inviterId },
  });

  const [{ data: { story } = { story: undefined } }] = useStoryQuery({
    variables: { id: notification.storyId },
  });

  return (
    <NotificationItemWrapper notification={notification}>
      <p className="text-sm">
        <Link href={`/user/${user?.username}`}>
          <a className="font-bold">{user?.username}</a>
        </Link>{" "}
        {t("notification.invite.text")}
      </p>
      <Link href={`/story/${notification.storyId}`}>
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
    </NotificationItemWrapper>
  );
};

const NotificationMain: React.FC = () => {
  const { t } = useI18n();

  const [{ data }] = useNotificationsQuery({
    variables: { limit: 30 },
    requestPolicy: "cache-and-network",
  });

  return (
    <>
      <h1 className="page-title">{t("notification.title")}</h1>
      <div className="px-4 space-y-2">
        {data?.notifications.map((notification) => {
          if (notification.__typename === "NotificationInvite")
            return (
              <NotificationInviteItem
                key={notification.id}
                notification={notification}
              />
            );
          else if (notification.__typename === "NotificationFollow")
            return (
              <NotificationFollowItem
                key={notification.id}
                notification={notification}
              />
            );
          return null;
        })}
      </div>
    </>
  );
};

export default NotificationMain;
