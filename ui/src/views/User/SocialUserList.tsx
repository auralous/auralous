import {
  LoadingScreen,
  RecyclerList,
  RecyclerRenderItem,
  UserListItem,
} from "@/components";
import { Size } from "@/styles";
import { Maybe, User, useUserQuery } from "@auralous/api";
import { createContext, FC, useCallback, useContext, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { UserFollowButton } from "./UserFollowButton";

interface SocialUserListProps {
  userIds: Maybe<string[]>;
  fetching?: boolean;
  onPressItem?: (user: User) => void;
  onUnauthenticated: () => void;
}

const ActionableContext = createContext(
  {} as Pick<SocialUserListProps, "onPressItem" | "onUnauthenticated">
);

const listPadding = Size[4];

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: listPadding,
  },
  itemInfo: { flex: 1 },
  itemRoot: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[10],
  },
});

const UserItem: FC<{ id: string }> = ({ id }) => {
  const [{ data, fetching }] = useUserQuery({ variables: { id } });

  const { onUnauthenticated, onPressItem } = useContext(ActionableContext);

  const onPress = useCallback(
    () => data?.user && onPressItem?.(data.user),
    [onPressItem, data?.user]
  );

  return (
    <View style={styles.itemRoot}>
      <Pressable onPress={onPress} style={styles.itemInfo}>
        <UserListItem user={data?.user || null} fetching={fetching} />
      </Pressable>
      <UserFollowButton id={id} onUnauthenticated={onUnauthenticated} />
    </View>
  );
};

const renderItem: RecyclerRenderItem<string> = ({ item }) => (
  <UserItem key={item} id={item} />
);

export const SocialUserList: FC<SocialUserListProps> = ({
  userIds,
  fetching,
  onPressItem,
  onUnauthenticated,
}) => {
  const actionableContextValue = useMemo(
    () => ({
      onPressItem,
      onUnauthenticated,
    }),
    [onPressItem, onUnauthenticated]
  );
  return (
    <ActionableContext.Provider value={actionableContextValue}>
      <RecyclerList
        contentContainerStyle={styles.content}
        ListEmptyComponent={fetching ? <LoadingScreen /> : null}
        data={userIds || []}
        height={Size[10] + Size[3]} // height + seperator
        renderItem={renderItem}
        contentHorizontalPadding={listPadding}
      />
    </ActionableContext.Provider>
  );
};
