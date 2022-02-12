import { useContainerStyle } from "@/components/Container";
import { SessionItem } from "@/components/Session";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { Size } from "@/styles/spacing";
import { useUiLayout } from "@/ui-context/UIContext";
import type { Session } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useState } from "react";
import type { ListRenderItem } from "react-native";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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
  const uiNumColumn = useUiLayout().column6432;
  return (
    <TouchableOpacity
      style={[styles.item, { maxWidth: (1 / uiNumColumn) * 100 + "%" }]}
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
  const [{ data: dataQuery }] = useSessionsQuery({
    variables: {
      limit: LIMIT,
      next,
    },
  });

  const loadMore = useCallback(() => {
    if (!dataQuery?.sessions.length) return;
    setNext(dataQuery.sessions[dataQuery.sessions.length - 1].id);
  }, [dataQuery?.sessions]);

  const { data, numColumns } = useFlatlist6432Layout(dataQuery?.sessions);

  const containerStyle = useContainerStyle();

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={data}
      style={styles.root}
      contentContainerStyle={containerStyle}
      numColumns={numColumns}
      onEndReached={loadMore}
      onEndReachedThreshold={Dimensions.get("window").height / 5}
    />
  );
};

export default SessionsScreen;
