import { IconMoreVertical } from "@/assets";
import { ContextMenuValue } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { useUIDispatch } from "@/ui-context";
import type { User } from "@auralous/api";
import { useUserQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserScreenContent } from "./components";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const HeaderRight: FC<{
  user?: User | null;
}> = ({ user }) => {
  const { t } = useTranslation();

  const uiDispatch = useUIDispatch();

  return (
    <Button
      variant="text"
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() =>
        user &&
        uiDispatch({
          type: "contextMenu",
          value: ContextMenuValue.user(uiDispatch, user),
        })
      }
    />
  );
};

const UserScreen: FC<NativeStackScreenProps<ParamList, RouteName.User>> = ({
  route,
  navigation,
}) => {
  const username = route.params.username;
  const [{ data, fetching }] = useUserQuery({
    variables: { username },
  });

  useLayoutEffect(() => {
    const user = data?.user;

    navigation.setOptions({
      ...(user && { title: user.username }),
      headerRight() {
        return <HeaderRight user={user} />;
      },
    });
  }, [data, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.user ? (
        <UserScreenContent user={data.user} />
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default UserScreen;
