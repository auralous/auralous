import { LoadingScreen } from "@/components/Loading";
import { ResultEmptyScreen } from "@/components/Result";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Session, SessionsQueryVariables } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import type {
  FlatListProps,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import SessionCardItem from "./SessionCardItem";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sep: {
    borderColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Size[4],
    width: "100%",
  },
});

const onEndReachedThreshold = Dimensions.get("window").height / 5;

const LIMIT = 10;

const MemoSessionCardItem = memo(SessionCardItem);

const renderItem: ListRenderItem<Session> = ({ item }) => (
  <MemoSessionCardItem session={item} key={item.id} />
);

const ItemSeparatorComponent = () => <View style={styles.sep} />;

const ITEM_HEIGHT = Size[32] + Size[4];
const getItemLayout = (data: unknown, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

export const SessionFeed: FC<
  Pick<SessionsQueryVariables, "creatorId" | "following"> & {
    contentContainerStyle?: StyleProp<ViewStyle>;
    ListHeaderComponent?: FlatListProps<Session>["ListHeaderComponent"];
  }
> = ({ contentContainerStyle, ListHeaderComponent, ...props }) => {
  const [next, setNext] = useState<undefined | string>();
  const [{ data, fetching }] = useSessionsQuery({
    variables: {
      limit: LIMIT,
      next,
      ...props,
    },
  });

  const loadMore = useCallback(() => {
    if (!data?.sessions.length) return;
    setNext(data.sessions[data.sessions.length - 1].id);
  }, [data?.sessions]);

  return (
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      style={styles.root}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
      ItemSeparatorComponent={ItemSeparatorComponent}
      data={data?.sessions}
      onEndReached={loadMore}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={contentContainerStyle}
    />
  );
};
