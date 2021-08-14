import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import { Maybe, User } from "@auralous/api";
import { FC, memo } from "react";
import { StyleSheet, View } from "react-native";

interface UserListItemProps {
  user: Maybe<User>;
  fetching?: boolean;
}

const styles = StyleSheet.create({
  info: {
    justifyContent: "center",
    padding: Size[1],
    paddingLeft: Size[2],
  },
  name: {
    lineHeight: Size[4],
  },
  root: {
    flexDirection: "row",
    flex: 1,
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
            <Text style={styles.name} bold size="xl">
              {user.username}
            </Text>
            <Spacer y={2} />
            {user.bio && <Text color="textTertiary" />}
          </View>
        </>
      )}
    </View>
  );
};

export default memo(UserListItem);
