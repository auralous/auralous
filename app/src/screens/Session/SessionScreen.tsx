import {
  IconEdit,
  IconHeadphones,
  IconMoreVertical,
  IconShare2,
  IconUser,
} from "@/assets";
import { TextButton } from "@/components/Button";
import { PageHeaderGradient } from "@/components/Color";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { Config } from "@/config";
import { useUiDispatch } from "@/context";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import type { Session } from "@auralous/api";
import { useMeQuery, useSessionQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionNewPrompts } from "./components/SessionNewPrompts";
import { SessionScreenContent } from "./Session";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const HeaderRight: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();
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
            meta: {
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
                        icon: <IconHeadphones stroke={Colors.textSecondary} />,
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
                    uiDispatch({
                      type: "share",
                      value: {
                        visible: true,
                        title: session.text,
                        url: `${Config.APP_URI}/session/${session.id}`,
                      },
                    });
                  },
                },
              ],
            },
          },
        });
      }}
    />
  );
};

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

    const uiDispatch = useUiDispatch();

    useEffect(() => {
      const session = data?.session;
      if (!session) return;
      navigation.setOptions({
        title: session.text,
        headerRight() {
          return <HeaderRight session={session} />;
        },
      });
    }, [navigation, me, data, t, uiDispatch]);
    const onQuickShare = useCallback(
      (session: Session) => {
        navigation.navigate(RouteName.NewQuickShare, {
          session: {
            ...session,
            // erase createdAt since Date object breaks navigation
            createdAt: null,
          },
        });
      },
      [navigation]
    );

    return (
      <SafeAreaView style={styles.root}>
        <PageHeaderGradient image={data?.session?.image} />
        {fetching ? (
          <LoadingScreen />
        ) : data?.session ? (
          <>
            <SessionScreenContent
              session={data.session}
              onQuickShare={onQuickShare}
            />
            {route.params.isNew && <SessionNewPrompts session={data.session} />}
          </>
        ) : (
          <NotFoundScreen />
        )}
      </SafeAreaView>
    );
  };

export default SessionScreen;
