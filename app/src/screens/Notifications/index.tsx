import { ParamList, RouteName } from "@/screens/types";
import {
  NotificationFollow,
  NotificationNewSession,
  useNotificationAddedSubscription,
  useNotificationsMarkReadMutation,
  useNotificationsQuery,
} from "@auralous/api";
import {
  Colors,
  LoadingScreen,
  NotificationFollowItem,
  NotificationNewSessionItem,
  RecyclerList,
  RecyclerRenderItem,
  Size,
} from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

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
  root: {
    paddingVertical: Size[1],
  },
});

export const NotificationsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Notifications>
> = ({ navigation }) => {
  const [next, setNext] = useState<string | undefined>();

  const [{ data, fetching }, refetchNotifications] = useNotificationsQuery({
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

  useEffect(() => {
    // refetch notification on navigate aways
    return navigation.addListener("blur", refetchNotifications);
  }, [refetchNotifications, navigation]);

  useNotificationAddedSubscription();

  return (
    <RecyclerList
      data={data?.notifications || []}
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      style={styles.root}
      renderItem={renderItem}
      height={Size[16]}
      onEndReached={onEndReached}
    />
  );
};
