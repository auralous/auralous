import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { ConstantSize } from "@/styles/spacing";
import { useSessionQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionScreenContent } from "./components";
import { SessionNewPrompts } from "./components/SessionNewPrompts";

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: ConstantSize.headerHeight },
});

const SessionScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Session>
> = ({ route, navigation }) => {
  const [{ data, fetching }] = useSessionQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  useLayoutEffect(() => {
    if (data?.session?.text)
      navigation.setOptions({
        title: data?.session.text,
      });
  }, [navigation, data?.session?.text]);

  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        LoadingScreen
      ) : data?.session ? (
        <>
          <SessionScreenContent session={data.session} />
          {route.params.isNew && <SessionNewPrompts session={data.session} />}
        </>
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default SessionScreen;
