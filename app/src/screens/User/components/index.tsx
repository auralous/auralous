import { Size } from "@/styles/spacing";
import { SessionFeed } from "@/views/SessionFeed";
import type { User } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import UserMeta from "./UserMeta";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Size[4],
    paddingTop: Size[4],
  },
});

export const UserScreenContent: FC<{
  user: User;
}> = ({ user }) => {
  const ListHeaderComponent = useMemo(() => <UserMeta user={user} />, [user]);

  return (
    <SessionFeed
      creatorId={user.id}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.content}
    />
  );
};
