import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { Session, useSessionQuery } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SessionEditDelete } from "./components/SessionEditDelete";
import { SessionEditMeta } from "./components/SessionEditMeta";
import { SessionEditUnlive } from "./components/SessionEditUnlive";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const SessionEditInner: FC<{ session: Session }> = ({ session }) => {
  return (
    <>
      {session.isLive && <SessionEditUnlive session={session} />}
      <SessionEditMeta session={session} />
      <SessionEditDelete session={session} />
    </>
  );
};

const SessionEditScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.SessionEdit>
> = ({ route }) => {
  const [{ data, fetching }] = useSessionQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.session ? (
        <SessionEditInner session={data.session} />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default SessionEditScreen;
