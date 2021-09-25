import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { Maybe, User } from "@auralous/api";
import type { FC } from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface UserListItemProps {
  user: Maybe<User>;
  fetching?: boolean;
}

const styles = StyleSheet.create({
  info: {
    justifyContent: "center",
    paddingLeft: Size[2],
    paddingRight: Size[1],
  },
  root: {
    flexDirection: "row",
    flex: 1,
    height: Size[10],
  },
});

const UserListItem: FC<UserListItemProps> = ({ user }) => {
  return (
    <View style={styles.root}>
      {user && (
        <>
          <Avatar
            username={user.username}
            href={user.profilePicture}
            size={10}
          />
          <View style={styles.info}>
            <Text bold>{user.username}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(UserListItem);
