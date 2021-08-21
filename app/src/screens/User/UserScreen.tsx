import { NotFoundScreen } from "@/components/NotFound";
import { useRootSheetModalsSetter } from "@/components/RootSheetModals";
import { ParamList, RouteName } from "@/screens/types";
import { useMeQuery, useUserQuery } from "@auralous/api";
import {
  Colors,
  IconEdit,
  IconMoreVertical,
  IconShare2,
  LoadingScreen,
  TextButton,
} from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Config from "react-native-config";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
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

  const rootSheetModalsSetter = useRootSheetModalsSetter();

  useEffect(() => {
    const user = data?.user;
    if (!user) return;

    if (user && user.id === me?.user.id) {
      navigation.setOptions({
        headerRight() {
          return (
            <TextButton
              icon={<IconMoreVertical width={21} height={21} />}
              accessibilityLabel={t("common.navigation.open_menu")}
              onPress={() => {
                rootSheetModalsSetter.actionSheet({
                  visible: true,
                  title: user.username,
                  image: user.profilePicture || undefined,
                  items: [
                    ...(user.id === me?.user.id
                      ? [
                          {
                            icon: <IconEdit stroke={Colors.textSecondary} />,
                            text: t("settings.edit_profile"),
                            onPress() {
                              navigation.navigate(RouteName.Settings);
                            },
                          },
                        ]
                      : []),
                    {
                      icon: <IconShare2 stroke={Colors.textSecondary} />,
                      text: t("share.share"),
                      onPress() {
                        Share.open({
                          title: user.username,
                          url: `${Config.WEB_URI}/u/${user.username}`,
                        }).catch(() => undefined);
                      },
                    },
                  ],
                });
              }}
            />
          );
        },
      });
    }
  }, [data, me, navigation, t, rootSheetModalsSetter]);

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
