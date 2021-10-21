import { useContainerStyle } from "@/components/Container";
import { SessionItem } from "@/components/Session";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { LayoutSize, Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { ListRenderItem } from "react-native";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: Size[2],
  },
  root: {
    flex: 1,
  },
});

const RecommendationItem: FC<{ session: Session }> = ({ session }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(RouteName.Session, { id: session.id })}
    >
      <SessionItem session={session} />
    </TouchableOpacity>
  );
};

const renderItem: ListRenderItem<Session> = ({ item }) => (
  <RecommendationItem session={item} key={item.id} />
);

const LIMIT = 20;

const SessionsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Sessions>
> = () => {
  const [next, setNext] = useState<undefined | string>();
  const [{ data }] = useSessionsQuery({
    variables: {
      limit: LIMIT,
      next,
    },
  });

  const loadMore = useCallback(() => {
    if (!data?.sessions.length) return;
    setNext(data.sessions[data.sessions.length - 1].id);
  }, [data?.sessions]);

  const windowWidth = useWindowDimensions().width;
  const numColumns =
    windowWidth >= 1366
      ? 6
      : windowWidth >= LayoutSize.lg
      ? 4
      : windowWidth >= LayoutSize.md
      ? 3
      : 2;

  const listData = useMemo(() => {
    if (!data?.sessions) return undefined;
    // If the # of items is odd, the last items will have full widths due to flex: 1
    // we manually cut them off
    const len = data.sessions.length;
    const maxlen = len - (len % numColumns);
    return data.sessions.slice(0, maxlen);
  }, [data, numColumns]);

  const containerStyle = useContainerStyle();

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={listData}
      style={styles.root}
      contentContainerStyle={containerStyle}
      numColumns={numColumns}
      onEndReached={loadMore}
    />
  );
};

export default SessionsScreen;
