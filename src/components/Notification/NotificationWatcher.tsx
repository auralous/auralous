import { Button } from "components/Pressable";
import {
  useNotificationAddedSubscription,
  UserDocument,
  UserQuery,
  UserQueryVariables,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { t } from "i18n/index";
import { useRouter } from "next/router";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useClient } from "urql";

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
        const tId = toast(
          <>
            <span>{message}</span>
            <Button
              title={t("common.go")}
              size="xs"
              onPress={() => {
                router.push("/notifications");
                toast.dismiss(tId);
              }}
              color="primary"
              style={{ marginLeft: ".5rem" }}
            />
          </>,
          { icon: "🔔" }
        );
      })();

      return data;
    },
    [router, client]
  );

  useNotificationAddedSubscription({ pause: !me }, onNotificationAdded);
  return <></>;
};

export default NotificationWatcher;
