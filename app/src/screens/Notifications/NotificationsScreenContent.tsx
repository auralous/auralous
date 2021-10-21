import { useContainerStyle } from "@/components/Container";
import { LoadingScreen } from "@/components/Loading";
import {
  NotificationFollowItem,
  NotificationNewSessionItem,
} from "@/components/Notification";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { NotificationFollow, NotificationNewSession } from "@auralous/api";
import {
  useNotificationAddedSubscription,
  useNotificationsMarkReadMutation,
  useNotificationsQuery,
} from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useState } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, TouchableHighlight } from "react-native";

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

const styles = StyleSheet.create({
  root: {
    paddingVertical: Size[1],
  },
});

const itemHeight = Size[16];
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});
const renderItem: ListRenderItem<NotificationFollow | NotificationNewSession> =
  (info) => {
    return <NotificationItem key={info.item.id} notification={info.item} />;
  };

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

  const containerStyle = useContainerStyle();

  return (
    <FlatList
      style={styles.root}
      contentContainerStyle={containerStyle}
      onEndReached={onEndReached}
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      data={data?.notifications || []}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
    />
  );
};
