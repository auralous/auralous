import { Avatar, Spacer, Text } from "@/components";
import { useUiNavigate } from "@/context";
import { Size } from "@/styles";
import { UserFollowButton } from "@/views";
import type { User } from "@auralous/api";
import { useUserStatQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  meta: {
    alignItems: "center",
    marginBottom: Size[2],
  },
  root: {
    padding: Size[2],
  },
  stat: {
    flex: 1,
    padding: Size[1],
  },
  statName: {
    textTransform: "uppercase",
  },
  statTouchable: {
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
  },
  username: {
    marginTop: Size[2],
  },
});

interface UserStatProps {
  name: string;
  value: number;
  onPress(): void;
}

const UserStat: FC<UserStatProps> = ({ name, value, onPress }) => {
  return (
    <View style={styles.stat}>
      <TouchableOpacity style={styles.statTouchable} onPress={onPress}>
        <Text bold size="xl" color="textSecondary">
          {value}
        </Text>
        <Spacer y={2} />
        <Text size="sm" color="textTertiary" style={styles.statName}>
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const UserMeta: FC<{
  user: User;
}> = ({ user }) => {
  const { t } = useTranslation();

  const [{ data: { userStat } = { userStat: undefined } }] = useUserStatQuery({
    variables: { id: user.id },
    requestPolicy: "cache-and-network",
  });

  const navigate = useUiNavigate();

  const gotoFollowers = useCallback(
    () => navigate("userFollowers", { username: user.username }),
    [user.username, navigate]
  );
  const gotoFollowing = useCallback(
    () => navigate("userFollowing", { username: user.username }),
    [user.username, navigate]
  );

  return (
    <>
      <View style={styles.root}>
        <View style={styles.meta}>
          <Avatar
            size={32}
            href={user.profilePicture}
            username={user.username}
          />
          <Text bold style={styles.username} size="2xl">
            {user.username}
          </Text>
        </View>
        <Spacer y={1} />
        <View style={styles.actions}>
          <UserFollowButton id={user.id} />
        </View>
        <Spacer y={2} />
        <View style={styles.stats}>
          <UserStat
            value={userStat?.followerCount || 0}
            name={t("user.followers")}
            onPress={gotoFollowers}
          />
          <UserStat
            value={userStat?.followingCount || 0}
            name={t("user.following")}
            onPress={gotoFollowing}
          />
        </View>
      </View>
    </>
  );
};

export default UserMeta;
