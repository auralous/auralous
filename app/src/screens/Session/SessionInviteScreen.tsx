import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import {
  useMeQuery,
  useSessionCollabAddFromTokenMutation,
  useSessionQuery,
} from "@auralous/api";
import player from "@auralous/player";
import {
  Avatar,
  Button,
  Heading,
  LoadingScreen,
  Size,
  Spacer,
  toast,
} from "@auralous/ui";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
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

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const [{ data: dataSession, fetching: fetchingSession }] = useSessionQuery({
    variables: { id: route.params.id },
  });

  const [{ data, fetching }, addCollab] =
    useSessionCollabAddFromTokenMutation();

  const playAndNavigate = useCallback(() => {
    player.playContext({
      id: route.params.id,
      type: "session",
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
      return navigation.navigate(RouteName.SignIn);
    }
    addCollab(route.params);
  }, [me, navigation, route.params, addCollab]);

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
