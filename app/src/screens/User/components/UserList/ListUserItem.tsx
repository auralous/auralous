import { RouteName } from "@/screens/types";
import { useUserQuery } from "@auralous/api";
import { Size, UserFollowButton, UserListItem } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[10],
  },
  user: { flex: 1 },
});

const ListUserItem: FC<{ id: string }> = ({ id }) => {
  const [{ data, fetching }] = useUserQuery({ variables: { id } });

  const navigation = useNavigation();

  const onUnauthenticated = useCallback(
    () => navigation.navigate(RouteName.SignIn),
    [navigation]
  );

  const onPress = useCallback(
    () =>
      data?.user &&
      navigation.navigate(RouteName.User, { username: data.user.username }),
    [navigation, data]
  );

  return (
    <View style={styles.root}>
      <Pressable onPress={onPress} style={styles.user}>
        <UserListItem user={data?.user || null} fetching={fetching} />
      </Pressable>
      <UserFollowButton id={id} onUnauthenticated={onUnauthenticated} />
    </View>
  );
};

export default memo(ListUserItem);
