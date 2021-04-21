import { useRoute } from "@react-navigation/core";
import { Header } from "components/Header";
import { LoadingBlock } from "components/Loading";
import { NotFound } from "components/Page";
import { User, useUserQuery } from "gql/gql.gen";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FollowersList from "./MetaList/FollowersList";
import FollowingsList from "./MetaList/FollowingsList";
import useStoreBottomSheet from "./MetaList/store";
import UserMeta from "./UserMeta";

interface RouteParams {
  username: string;
}

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

const Container: React.FC = () => {
  const route = useRoute();
  const username = (route.params as RouteParams | undefined)?.username;
  const [{ data: { user } = { user: undefined }, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  return (
    <>
      <Header title="" />
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

export default Container;
