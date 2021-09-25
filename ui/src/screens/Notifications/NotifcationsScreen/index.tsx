import type { RecyclerRenderItem } from "@/components";
import {
  Container,
  LoadingScreen,
  NotificationFollowItem,
  NotificationNewSessionItem,
  RecyclerList,
} from "@/components";
import { RouteName } from "@/screens/types";
import { Colors, Size } from "@/styles";
import type { NotificationFollow, NotificationNewSession } from "@auralous/api";
import {
  useNotificationAddedSubscription,
  useNotificationsMarkReadMutation,
  useNotificationsQuery,
} from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";

const NotificationItem: FC<{
  notification: NotificationFollow | NotificationNewSession;
}> = ({ notification }) => {
  const navigation = useNavigation();

  const [, notificationsMarkRead] = useNotificationsMarkReadMutation();

  const onPress = useCallback(() => {
    notificationsMarkRead({ ids: [notification.id] }).catch(() => undefined);
    if (notification.__typename === "NotificationFollow") {
      if (notification.follower)
        navigation.navigate(RouteName.User, {
          username: notification.follower.username,
        });
    } else {
      if (notification.session)
        navigation.navigate(RouteName.Session, {
          id: notification.session.id,
        });
    }
  }, [notification, navigation, notificationsMarkRead]);

  return (
    <TouchableHighlight
      underlayColor={Colors.backgroundSecondary}
      onPress={onPress}
    >
      {notification.__typename === "NotificationFollow" ? (
        <NotificationFollowItem notification={notification} />
      ) : (
        <NotificationNewSessionItem notification={notification} />
      )}
    </TouchableHighlight>
  );
};

const renderItem: RecyclerRenderItem<
  NotificationFollow | NotificationNewSession
> = (info) => {
  return <NotificationItem key={info.item.id} notification={info.item} />;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  root: {
    paddingVertical: Size[1],
  },
});

export const NotificationsScreenContent = () => {
  const [next, setNext] = useState<string | undefined>();

  const [{ data, fetching }] = useNotificationsQuery({
    variables: {
      limit: 10,
      next,
    },
    requestPolicy: "cache-and-network",
  });

  const onEndReached = useCallback(() => {
    if (!data?.notifications) return;
    setNext(data.notifications[data.notifications.length - 1].id);
  }, [data]);

  useNotificationAddedSubscription();

  return (
    <Container style={styles.container}>
      <RecyclerList
        data={data?.notifications || []}
        ListEmptyComponent={fetching ? <LoadingScreen /> : null}
        style={styles.root}
        renderItem={renderItem}
        height={Size[16]}
        onEndReached={onEndReached}
      />
    </Container>
  );
};
