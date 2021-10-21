import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { useSessionQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SessionEditScreenContent } from "./components";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

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
        <SessionEditScreenContent session={data.session} />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default SessionEditScreen;
