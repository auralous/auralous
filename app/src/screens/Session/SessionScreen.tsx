import { PageHeaderGradient } from "@/components/Colors";
import { NotFoundScreen } from "@/components/NotFound";
import { useRootSheetModalsSetter } from "@/components/RootSheetModals";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useMeQuery, useSessionQuery } from "@auralous/api";
import {
  Colors,
  IconEdit,
  IconHeadphones,
  IconMoreVertical,
  IconShare2,
  IconUser,
  LoadingScreen,
  TextButton,
} from "@auralous/ui";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Config from "react-native-config";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import SessionLiveContent from "./components/SessionLiveContent";
import { SessionNewPrompts } from "./components/SessionNewPrompts";
import SessionNonLiveContent from "./components/SessionNonLiveContent";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const SessionScreen: FC<NativeStackScreenProps<ParamList, RouteName.Session>> =
  ({ route, navigation }) => {
    const { t } = useTranslation();

    const [{ data, fetching }] = useSessionQuery({
      variables: {
        id: route.params.id,
      },
      requestPolicy: "cache-and-network",
    });

    const [{ data: { me } = { me: undefined } }] = useMeQuery();

    const rootSheetModalsSetter = useRootSheetModalsSetter();

    useEffect(() => {
      const session = data?.session;
      if (!session) return;
      navigation.setOptions({
        headerRight() {
          return (
            <TextButton
              icon={<IconMoreVertical width={21} height={21} />}
              accessibilityLabel={t("common.navigation.open_menu")}
              onPress={() => {
                rootSheetModalsSetter.actionSheet({
                  visible: true,
                  title: session.text,
                  subtitle: session.creator.username,
                  image: session.image || undefined,
                  items: [
                    ...(session.creatorId === me?.user.id
                      ? [
                          {
                            icon: <IconEdit stroke={Colors.textSecondary} />,
                            text: t("session_edit.title"),
                            onPress() {
                              navigation.navigate(RouteName.SessionEdit, {
                                id: session.id,
                              });
                            },
                          },
                        ]
                      : []),
                    ...(session.isLive
                      ? [
                          {
                            icon: (
                              <IconHeadphones stroke={Colors.textSecondary} />
                            ),
                            text: t("session_listeners.title"),
                            onPress() {
                              navigation.navigate(RouteName.SessionListeners, {
                                id: session.id,
                              });
                            },
                          },
                        ]
                      : []),
                    {
                      icon: <IconUser stroke={Colors.textSecondary} />,
                      text: t("session.creator"),
                      onPress() {
                        navigation.navigate(RouteName.User, {
                          username: session.creator.username,
                        });
                      },
                    },
                    {
                      icon: <IconShare2 stroke={Colors.textSecondary} />,
                      text: t("share.share"),
                      onPress() {
                        Share.open({
                          title: session.text,
                          url: `${Config.WEB_URI}/session/${session.id}`,
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
    }, [navigation, me, data, t, rootSheetModalsSetter]);

    return (
      <SafeAreaView style={styles.root}>
        <PageHeaderGradient image={data?.session?.image} />
        {fetching ? (
          <LoadingScreen />
        ) : data?.session ? (
          data.session.isLive ? (
            <>
              <SessionLiveContent session={data.session} />
              {route.params.isNew && (
                <SessionNewPrompts session={data.session} />
              )}
            </>
          ) : (
            <SessionNonLiveContent session={data.session} />
          )
        ) : (
          <NotFoundScreen />
        )}
      </SafeAreaView>
    );
  };

export default SessionScreen;
