import { Avatar } from "components/Avatar";
import { Text } from "components/Typography";
import { User, useUserStatQuery } from "gql/gql.gen";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "styles";
import useStoreBottomSheet from "./MetaList/store";

const styles = StyleSheet.create({
  root: {
    padding: Size[2],
  },
  meta: {
    alignItems: "center",
    marginBottom: Size[6],
  },
  username: {
    marginTop: Size[2],
  },
  stats: {
    flexDirection: "row",
  },
  stat: {
    flex: 1,
    padding: Size[1],
  },
  statTouchable: {
    alignItems: "center",
  },
  statName: {
    textTransform: "uppercase",
  },
  statValue: {},
});

interface UserStatProps {
  name: string;
  value: number;
  list?: "followers" | "followings";
}

const UserStat: React.FC<UserStatProps> = ({ name, value, list }) => {
  const open = useStoreBottomSheet((state) => state.open);
  return (
    <View style={styles.stat}>
      <TouchableOpacity
        style={styles.statTouchable}
        onPress={() => list && open(list)}
      >
        <Text bold size="xl" color="textSecondary" style={styles.statValue}>
          {value}
        </Text>
        <Text size="sm" color="textTertiary" style={styles.statName}>
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const UserMeta: React.FC<{ user: User }> = ({ user }) => {
  const [{ data: { userStat } = { userStat: undefined } }] = useUserStatQuery({
    variables: { id: user.id },
    requestPolicy: "cache-and-network",
  });

  const { t } = useTranslation();

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
        <View style={styles.stats}>
          <UserStat
            value={userStat?.followerCount || 0}
            name={t("user.followers")}
            list="followers"
          />
          <UserStat
            value={userStat?.followingCount || 0}
            name={t("user.followings")}
            list="followings"
          />
        </View>
      </View>
    </>
  );
};

export default UserMeta;
