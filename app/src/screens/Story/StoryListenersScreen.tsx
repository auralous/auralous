import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  User,
  useStoryListenersQuery,
  useStoryListenersUpdatedSubscription,
} from "@auralous/api";
import { LoadingScreen, SocialUserList } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const StoryListenersScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.StoryListeners>
> = ({ navigation, route }) => {
  const [{ data, fetching }] = useStoryListenersQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  useStoryListenersUpdatedSubscription({
    variables: {
      id: route.params.id,
    },
  });

  const onUnauthenticated = useCallback(
    () => navigation.navigate(RouteName.SignIn),
    [navigation]
  );

  const onPressItem = useCallback(
    (user: User) => {
      navigation.navigate(RouteName.User, { username: user.username });
    },
    [navigation]
  );

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.storyListeners ? (
        <SocialUserList
          userIds={data?.storyListeners || null}
          onUnauthenticated={onUnauthenticated}
          onPressItem={onPressItem}
        />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default StoryListenersScreen;
