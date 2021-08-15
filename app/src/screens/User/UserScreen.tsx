import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useMeQuery, useUserQuery } from "@auralous/api";
import { IconSettings, LoadingScreen, TextButton } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMeta from "./components/UserMeta";
import { UserTimeline } from "./components/UserTimeline";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserScreen: FC<NativeStackScreenProps<ParamList, RouteName.User>> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();

  const username = route.params.username;
  const [{ data, fetching }] = useUserQuery({
    variables: { username },
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(() => {
    const user = data?.user;
    if (user && user.id === me?.user.id) {
      navigation.setOptions({
        headerRight() {
          return (
            <GestureHandlerRootView>
              <TextButton
                icon={<IconSettings width={21} height={21} />}
                onPress={() => navigation.navigate(RouteName.Settings)}
                accessibilityLabel={t("settings.title")}
              />
            </GestureHandlerRootView>
          );
        },
      });
    }
  }, [data, me, navigation, t]);

  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.user ? (
        <>
          <UserMeta user={data.user} />
          <UserTimeline user={data.user} />
        </>
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default UserScreen;
