import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { Spacer } from "@/components/Spacer";
import { toast } from "@/components/Toast";
import { Heading } from "@/components/Typography";
import player from "@/player";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import {
  useMeQuery,
  useSessionCollabAddFromTokenMutation,
  useSessionQuery,
} from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: "space-between", padding: Size[6] },
  root: { flex: 1 },
  top: { alignItems: "center", flex: 1 },
});

const SessionInviteScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.SessionInvite>
> = ({ navigation, route }) => {
  const { t } = useTranslation();

  const uiDispatch = useUiDispatch();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const [{ data: dataSession, fetching: fetchingSession }] = useSessionQuery({
    variables: { id: route.params.id },
  });

  useLayoutEffect(() => {
    if (dataSession?.session) {
      navigation.setOptions({
        title: t("session_invite.title", { name: dataSession?.session?.text }),
      });
    }
  }, [t, dataSession, navigation]);

  const [{ data, fetching }, addCollab] =
    useSessionCollabAddFromTokenMutation();

  const playAndNavigate = useCallback(() => {
    player.playContext({
      id: ["session", route.params.id],
      shuffle: false,
    });
    navigation.replace(RouteName.Session, { id: route.params.id });
  }, [navigation, route.params.id]);

  useEffect(() => {
    // If user is already a collaborator, redirect right away
    if (me && dataSession?.session?.collaboratorIds.includes(me.user.id)) {
      playAndNavigate();
    }
  }, [dataSession, playAndNavigate, me]);

  const onPress = useCallback(() => {
    if (!me) {
      return uiDispatch({ type: "signIn", value: { visible: true } });
    }
    addCollab(route.params);
  }, [me, uiDispatch, route.params, addCollab]);

  useEffect(() => {
    if (data?.sessionCollabAddFromToken === true) {
      playAndNavigate();
    } else if (data?.sessionCollabAddFromToken === false) {
      toast.error(t("session_invite.invite_invalid"));
    }
  }, [data?.sessionCollabAddFromToken, t, playAndNavigate]);

  return (
    <View style={styles.root}>
      {fetchingSession || me === undefined ? (
        <LoadingScreen />
      ) : dataSession?.session ? (
        <View style={styles.content}>
          <View style={styles.top}>
            <Avatar
              size={32}
              href={dataSession.session.creator.profilePicture}
              username={dataSession.session.creator.username}
            />
            <Spacer y={4} />
            <Heading level={4} align="center">
              {t("session_invite.title", { name: dataSession.session.text })}
            </Heading>
          </View>
          <Button variant="filled" disabled={fetching} onPress={onPress}>
            {t("session_invite.accept_invitation")}
          </Button>
        </View>
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default SessionInviteScreen;
