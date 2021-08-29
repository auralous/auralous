import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import {
  useMeQuery,
  useSessionInviteLinkQuery,
  useSessionQuery,
  useUserQuery,
} from "@auralous/api";
import { Button, LoadingScreen, Size, UserListItem } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Share from "react-native-share";

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

  const onInvitePress = useCallback(() => {
    Share.open({
      title: t("session_invite.title", { name: dataSession?.session?.text }),
      url: dataSessionInviteLink?.sessionInviteLink,
    }).catch(() => undefined);
  }, [t, dataSession?.session?.text, dataSessionInviteLink?.sessionInviteLink]);

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
