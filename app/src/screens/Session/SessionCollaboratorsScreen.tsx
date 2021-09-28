import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { UserListItem } from "@/components/User";
import { useUiDispatch } from "@/context";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import {
  useMeQuery,
  useSessionInviteLinkQuery,
  useSessionQuery,
  useUserQuery,
} from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  invite: {
    padding: Size[2],
  },
  item: {
    marginBottom: Size[4],
    width: "100%",
  },
  root: { flex: 1 },
  scroll: {
    flex: 1,
    paddingHorizontal: Size[4],
    paddingVertical: Size[4],
  },
});

const SessionCollaborator: FC<{
  id: string;
  userId: string;
}> = ({ userId }) => {
  const [{ data, fetching }] = useUserQuery({
    variables: { id: userId },
  });

  const navigation = useNavigation();

  const onPress = useCallback(
    () =>
      data?.user &&
      navigation.navigate(RouteName.User, { username: data.user.username }),
    [navigation, data]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <UserListItem user={data?.user || null} fetching={fetching} />
    </TouchableOpacity>
  );
};

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
        <ScrollView style={styles.scroll}>
          {dataSession.session.collaboratorIds.map((collaboratorId) => (
            <SessionCollaborator
              key={collaboratorId}
              id={route.params.id}
              userId={collaboratorId}
            />
          ))}
        </ScrollView>
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
