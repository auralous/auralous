import { Button, TextButton } from "@/components/Button";
import { UserListItem } from "@/components/User";
import {
  useUserFollowMutation,
  useUserQuery,
  useUserUnfollowMutation,
} from "@/gql/gql.gen";
import { useMe, useMeFollowings } from "@/gql/hooks";
import { Size } from "@/styles";
import { useNavigation } from "@react-navigation/core";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Size[4],
  },
});

const ListItem: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useUserQuery({ variables: { id } });
  const me = useMe();

  const navigation = useNavigation();

  const [
    { data: { userFollowings } = { userFollowings: undefined } },
  ] = useMeFollowings();

  const followed = useMemo(() => Boolean(userFollowings?.includes(id)), [
    userFollowings,
    id,
  ]);

  const [{ fetching: fetchingFollow }, followUser] = useUserFollowMutation();
  const [
    { fetching: fetchingUnfollow },
    unfollowUser,
  ] = useUserUnfollowMutation();

  return (
    <View style={styles.root}>
      <UserListItem user={data?.user || null} fetching={fetching} />
      {followed ? (
        <TextButton
          onPress={() =>
            me ? unfollowUser({ id }) : navigation.navigate("login")
          }
          disabled={fetchingUnfollow}
        >
          {t("user.unfollow")}
        </TextButton>
      ) : (
        <Button
          onPress={() =>
            me ? followUser({ id }) : navigation.navigate("login")
          }
          disabled={fetchingFollow}
        >
          {t("user.follow")}
        </Button>
      )}
    </View>
  );
};

export default ListItem;
