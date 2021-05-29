import { HeaderBackable } from "@/components/Header";
import { LoadingBlock } from "@/components/Loading";
import { NotFound } from "@/components/Page";
import { User, useUserQuery } from "@/gql/gql.gen";
import { RootStackParamList, RouteName } from "@/screens/types";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FollowersList from "./MetaList/FollowersList";
import FollowingsList from "./MetaList/FollowingsList";
import useStoreBottomSheet from "./MetaList/store";
import UserMeta from "./UserMeta";

const styles = StyleSheet.create({
  fullPageCenter: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
});

const ContainerContent: React.FC<{ user: User }> = ({ user }) => {
  const closeSheet = useStoreBottomSheet((state) => state.close);
  useEffect(() => {
    return () => closeSheet();
  }, [closeSheet]);
  return (
    <>
      <ScrollView>
        <UserMeta user={user} />
      </ScrollView>
      <FollowersList user={user} />
      <FollowingsList user={user} />
    </>
  );
};

const UserScreen: React.FC<
  StackScreenProps<RootStackParamList, RouteName.User>
> = ({ route }) => {
  const username = route.params.username;
  const [{ data: { user } = { user: undefined }, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  return (
    <>
      <HeaderBackable title="" />
      {fetching ? (
        <View style={styles.fullPageCenter}>
          <LoadingBlock />
        </View>
      ) : user ? (
        <ContainerContent user={user} />
      ) : (
        <View style={styles.fullPageCenter}>
          <NotFound />
        </View>
      )}
    </>
  );
};

export default UserScreen;
