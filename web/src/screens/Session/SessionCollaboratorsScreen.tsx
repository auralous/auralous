import { NavPlaceholder } from "@/components/Layout";
import { NotFoundScreen } from "@/components/NotFound";
import {
  useMeQuery,
  useSessionInviteLinkQuery,
  useSessionQuery,
  useUserQuery,
} from "@auralous/api";
import {
  Button,
  Container,
  LoadingScreen,
  Size,
  UserListItem,
} from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import type { RouteComponentProps } from "react-router";
import { useHistory } from "react-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

  const history = useHistory();

  const onPress = useCallback(
    () => data?.user && history.push(`/user/${data.user.username}`),
    [history, data]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <UserListItem user={data?.user || null} fetching={fetching} />
    </TouchableOpacity>
  );
};

export const SessionCollaboratorsScreen: FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { t } = useTranslation();

  const [{ data: dataSession, fetching }] = useSessionQuery({
    variables: { id: match.params.id },
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const shouldShowInviteButton = Boolean(
    dataSession?.session &&
      me &&
      dataSession.session.collaboratorIds.includes(me.user.id)
  );

  const [{ data: dataSessionInviteLink }] = useSessionInviteLinkQuery({
    variables: { id: match.params.id },
    pause: !shouldShowInviteButton,
  });

  const onInvitePress = useCallback(() => {
    navigator.share({
      title: t("session_invite.title", { name: dataSession?.session?.text }),
      url: dataSessionInviteLink?.sessionInviteLink,
    });
  }, [t, dataSession?.session?.text, dataSessionInviteLink?.sessionInviteLink]);

  console.log(dataSessionInviteLink);

  return (
    <View style={styles.root}>
      <Container style={styles.container}>
        <NavPlaceholder />
        {fetching ? (
          <LoadingScreen />
        ) : dataSession?.session ? (
          <ScrollView style={styles.scroll}>
            {dataSession.session.collaboratorIds.map((collaboratorId) => (
              <SessionCollaborator
                key={collaboratorId}
                id={match.params.id}
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
      </Container>
    </View>
  );
};
