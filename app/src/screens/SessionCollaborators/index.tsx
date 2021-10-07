import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import { SocialUserList } from "@/views/User";
import {
  useMeQuery,
  useSessionInviteLinkQuery,
  useSessionQuery,
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

const SessionCollaboratorsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Session>
> = ({ route }) => {
  const { t } = useTranslation();

  const [{ data: dataSession, fetching }] = useSessionQuery({
    variables: { id: route.params.id },
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const shouldShowInviteButton = Boolean(
    dataSession?.session &&
      me &&
      dataSession.session.collaboratorIds.includes(me.user.id)
  );

  const [{ data: dataSessionInviteLink }] = useSessionInviteLinkQuery({
    variables: { id: route.params.id },
    pause: !shouldShowInviteButton,
  });

  const uiDispatch = useUiDispatch();

  const onInvitePress = useCallback(() => {
    uiDispatch({
      type: "share",
      value: {
        visible: true,
        title: t("session_invite.title", { name: dataSession?.session?.text }),
        url: dataSessionInviteLink?.sessionInviteLink,
      },
    });
  }, [
    t,
    uiDispatch,
    dataSession?.session?.text,
    dataSessionInviteLink?.sessionInviteLink,
  ]);

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : dataSession?.session ? (
        <SocialUserList userIds={dataSession.session.collaboratorIds} />
      ) : (
        <NotFoundScreen />
      )}
      {shouldShowInviteButton && dataSessionInviteLink && (
        <View style={styles.invite}>
          <Button variant="primary" onPress={onInvitePress}>
            {t("share.invite_friends")}
          </Button>
        </View>
      )}
    </View>
  );
};

export default SessionCollaboratorsScreen;
