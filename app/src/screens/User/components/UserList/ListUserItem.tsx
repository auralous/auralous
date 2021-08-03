import { RouteName } from "@/screens/types";
import {
  useMeQuery,
  useUserFollowingsQuery,
  useUserFollowMutation,
  useUserQuery,
  useUserUnfollowMutation,
} from "@auralous/api";
import { Button, TextButton, UserListItem } from "@auralous/ui";
import { useNavigation } from "@react-navigation/core";
import { FC, memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const ListUserItem: FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useUserQuery({ variables: { id } });
  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const navigation = useNavigation();

  const [{ data: { userFollowings } = { userFollowings: undefined } }] =
    useUserFollowingsQuery({
      variables: { id: me?.user.id || "" },
      pause: !me,
    });

  const followed = useMemo(
    () => Boolean(userFollowings?.includes(id)),
    [userFollowings, id]
  );

  const [{ fetching: fetchingFollow }, followUser] = useUserFollowMutation();
  const [{ fetching: fetchingUnfollow }, unfollowUser] =
    useUserUnfollowMutation();

  const onUnfollow = useCallback(
    () => (me ? unfollowUser({ id }) : navigation.navigate(RouteName.SignIn)),
    [me, unfollowUser, navigation, id]
  );

  const onFollow = useCallback(
    () => (me ? followUser({ id }) : navigation.navigate(RouteName.SignIn)),
    [me, followUser, navigation, id]
  );

  return (
    <View style={styles.root}>
      <UserListItem user={data?.user || null} fetching={fetching} />
      {followed ? (
        <TextButton onPress={onUnfollow} disabled={fetchingUnfollow}>
          {t("user.unfollow")}
        </TextButton>
      ) : (
        <Button onPress={onFollow} disabled={fetchingFollow}>
          {t("user.follow")}
        </Button>
      )}
    </View>
  );
};

export default memo(ListUserItem);
