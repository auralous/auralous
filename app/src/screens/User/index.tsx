import { ParamList, RouteName } from "@/screens/types";
import { User, useUserQuery } from "@auralous/api";
import { HeaderBackable, LoadingBlock, NotFound } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ContextMetaList, MetaListState } from "./MetaList/Context";
import FollowersList from "./MetaList/FollowersList";
import FollowingsList from "./MetaList/FollowingsList";
import UserMeta from "./UserMeta";

const styles = StyleSheet.create({
  fullPageCenter: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
});

const ContainerContent: React.FC<{ user: User }> = ({ user }) => {
  const [list, setList] = useState<MetaListState[0]>(null);

  useEffect(() => {
    return () => setList(null);
  }, []);
  return (
    <ContextMetaList.Provider value={[list, setList]}>
      <ScrollView>
        <UserMeta user={user} />
      </ScrollView>
      <FollowersList user={user} />
      <FollowingsList user={user} />
    </ContextMetaList.Provider>
  );
};

const UserScreen: React.FC<StackScreenProps<ParamList, RouteName.User>> = ({
  route,
}) => {
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
