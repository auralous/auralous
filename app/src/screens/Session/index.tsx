import {
  IconEdit,
  IconHeadphones,
  IconMoreVertical,
  IconShare2,
  IconUser,
  IconX,
} from "@/assets";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { Config } from "@/config";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { ConstantSize } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import { isTruthy } from "@/utils/utils";
import type { Session } from "@auralous/api";
import { useMeQuery, useSessionQuery } from "@auralous/api";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionScreenContent } from "./components";
import { SessionNewPrompts } from "./components/SessionNewPrompts";

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: ConstantSize.headerHeight },
});

const HeaderRight: FC<{
  session?: Session | null;
  navigation: NativeStackNavigationProp<ParamList, RouteName.Session>;
}> = ({ session, navigation }) => {
  const { t } = useTranslation();

  const uiDispatch = useUiDispatch();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const isCreator = session?.creatorId === me?.user.id;

  return (
    <Button
      variant="text"
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() => {
        session &&
          uiDispatch({
            type: "contextMenu",
            value: {
              visible: true,
              title: session.text,
              subtitle: session.creator.username,
              image: session.image || undefined,
              items: [
                isCreator && {
                  icon: <IconEdit stroke={Colors.textSecondary} />,
                  text: t("session_edit.title"),
                  onPress() {
                    navigation.navigate(RouteName.SessionEdit, {
                      id: session.id,
                    });
                  },
                },
                session.isLive && {
                  icon: <IconHeadphones stroke={Colors.textSecondary} />,
                  text: t("session_listeners.title"),
                  onPress() {
                    navigation.navigate(RouteName.SessionListeners, {
                      id: session.id,
                    });
                  },
                },
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
                isCreator &&
                  session.isLive && {
                    icon: <IconX stroke={Colors.textSecondary} />,
                    text: t("session_edit.live.end"),
                    onPress() {
                      navigation.navigate(RouteName.SessionEdit, {
                        id: session.id,
                        showEndModal: true,
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

const SessionScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Session>
> = ({ route, navigation }) => {
  const { t } = useTranslation();
  // FIXME: This causes setState in render
  const [{ data, fetching }] = useSessionQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const uiDispatch = useUiDispatch();

  useLayoutEffect(() => {
    const session = data?.session;
    navigation.setOptions({
      ...(session && { title: session.text }),
      headerRight() {
        return <HeaderRight navigation={navigation} session={session} />;
      },
    });
  }, [navigation, me, data, t, uiDispatch]);

  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        <LoadingScreen />
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
