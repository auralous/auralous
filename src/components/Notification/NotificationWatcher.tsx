import {
  useNotificationAddedSubscription,
  UserDocument,
  UserQuery,
  UserQueryVariables,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { t } from "i18n/index";
import { useRouter } from "next/router";
import { NotyfEvent } from "notyf";
import { useCallback } from "react";
import { useClient } from "urql";
import { toast } from "utils/toast";

const NotificationWatcher: React.FC = () => {
  const me = useMe();

  const client = useClient();
  const router = useRouter();

  const onNotificationAdded = useCallback(
    (prev, data) => {
      const getUsername = (id: string) => {
        return client
          .query<UserQuery, UserQueryVariables>(UserDocument, { id })
          .toPromise()
          .then((result) => result.data?.user?.username || "");
      };

      (async () => {
        let message: string;
        if (data.notificationAdded.__typename === "NotificationFollow") {
          const username = await getUsername(data.notificationAdded.followerId);
          message = `${username} ${t("notification.follow.text")}`;
        } else if (data.notificationAdded.__typename === "NotificationInvite") {
          const username = await getUsername(data.notificationAdded.inviterId);
          message = `${username} ${t("notification.invite.text")}`;
        } else {
          const username = await getUsername(data.notificationAdded.creatorId);
          message = `${username} ${t("notification.newStory.text")}`;
        }
        toast.open({ type: "noti", message }).on(NotyfEvent.Click, () => {
          router.push("/notifications");
        });
      })();

      return data;
    },
    [router, client]
  );

  useNotificationAddedSubscription({ pause: !me }, onNotificationAdded);
  return <></>;
};

export default NotificationWatcher;
