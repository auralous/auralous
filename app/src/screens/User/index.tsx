import { IconEdit, IconMoreVertical, IconShare2 } from "@/assets";
import { TextButton } from "@/components/Button";
import { PageHeaderGradient } from "@/components/Color";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { Config } from "@/config";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { useUiDispatch } from "@/ui-context";
import { isTruthy } from "@/utils/utils";
import type { User } from "@auralous/api";
import { useMeQuery, useUserQuery } from "@auralous/api";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { FC } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserScreenContent } from "./components";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const HeaderRight: FC<{
  navigation: NativeStackNavigationProp<ParamList, RouteName.User>;
  user: User;
}> = ({ navigation, user }) => {
  const { t } = useTranslation();

  const uiDispatch = useUiDispatch();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  return (
    <TextButton
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() => {
        uiDispatch({
          type: "contextMenu",
          value: {
            visible: true,
            title: user.username,
            image: user.profilePicture || undefined,
            items: [
              user.id === me?.user.id && {
                icon: <IconEdit stroke={Colors.textSecondary} />,
                text: t("settings.edit_profile"),
                onPress() {
                  navigation.navigate(RouteName.Settings);
                },
              },
              {
                icon: <IconShare2 stroke={Colors.textSecondary} />,
                text: t("share.share"),
                onPress() {
                  uiDispatch({
                    type: "share",
                    value: {
                      visible: true,
                      title: user.username,
                      url: `${Config.APP_URI}/u/${user.username}`,
                    },
                  });
                },
              },
            ].filter(isTruthy),
          },
        });
      }}
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

  useEffect(() => {
    const user = data?.user;
    if (!user) return;

    navigation.setOptions({
      title: user.username,
      headerRight() {
        return <HeaderRight navigation={navigation} user={user} />;
      },
    });
  }, [data, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <PageHeaderGradient image={data?.user?.profilePicture} />
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
