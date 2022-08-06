import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUIDispatch } from "@/ui-context";
import { isTruthy } from "@/utils/utils";
import { SocialUserList } from "@/views/User";
import type { Session } from "@auralous/api";
import {
  useMeQuery,
  useSessionInviteLinkQuery,
  useSessionQuery,
  useUsersQuery,
} from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  invite: {
    padding: Size[2],
  },
  root: { flex: 1, paddingTop: Size[2] },
});

const SessionInviteButton: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const shouldShowInviteButton = Boolean(
    me && session.collaboratorIds.includes(me.user.id)
  );

  const [{ data: dataSessionInviteLink, fetching }] = useSessionInviteLinkQuery(
    {
      variables: { id: session.id },
      pause: !shouldShowInviteButton,
    }
  );

  const sessionInviteLink = dataSessionInviteLink?.sessionInviteLink;

  const uiDispatch = useUIDispatch();

  const onInvitePress = useCallback(() => {
    uiDispatch({
      type: "share",
      value: {
        visible: true,
        title: t("session_invite.title", { name: session.text }),
        url: sessionInviteLink,
      },
    });
  }, [t, uiDispatch, session.text, sessionInviteLink]);

  if (!shouldShowInviteButton) return null;

  return (
    <View style={styles.invite}>
      <Button variant="primary" onPress={onInvitePress} disabled={fetching}>
        {t("share.invite_friends")}
      </Button>
    </View>
  );
};

const SessionCollaboratorsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Session>
> = ({ route }) => {
  const [{ data: dataSession, fetching }] = useSessionQuery({
    variables: { id: route.params.id },
  });

  const [{ data: dataUsers, fetching: fetchingUsers }] = useUsersQuery({
    variables: {
      ids: dataSession?.session?.collaboratorIds || [],
    },
    pause: !dataSession?.session?.collaboratorIds.length,
  });

  const users = dataUsers?.users?.filter(isTruthy);

  return (
    <View style={styles.root}>
      {fetching || fetchingUsers ? (
        <LoadingScreen />
      ) : dataSession?.session ? (
        <>
          <SocialUserList users={users || null} />
          <SessionInviteButton session={dataSession.session} />
        </>
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default SessionCollaboratorsScreen;
