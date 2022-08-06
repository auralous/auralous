import { RNLink } from "@/components/Link";
import { LoadingScreen } from "@/components/Loading";
import { SessionItem } from "@/components/Session";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { use6432Layout } from "@/ui-context";
import SearchEmpty from "@/views/SongSelector/SearchEmpty";
import type { Session } from "@auralous/api";
import { useSessionsSearchQuery } from "@auralous/api";
import type { FC } from "react";
import { memo } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./ItemsSearch.styles";

const SearchItem = memo<{ session: Session }>(function SearchItem({ session }) {
  const uiNumColumn = use6432Layout();
  return (
    <RNLink
      style={[styles.item, { maxWidth: (1 / uiNumColumn) * 100 + "%" }]}
      to={{
        screen: RouteName.Session,
        params: { id: session.id },
      }}
    >
      <SessionItem session={session} />
    </RNLink>
  );
});

const renderItem: ListRenderItem<Session> = ({ item }) => (
  <SearchItem session={item} key={item.id} />
);

const SessionsSearch: FC<{ query: string }> = ({ query }) => {
  const [{ data: dataQuery, fetching }] = useSessionsSearchQuery({
    variables: { query },
  });

  const { data, numColumns } = useFlatlist6432Layout(dataQuery?.sessionsSearch);

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={data}
      style={styles.root}
      contentContainerStyle={styles.horPad}
      numColumns={numColumns}
      ListEmptyComponent={fetching ? LoadingScreen : SearchEmpty}
    />
  );
};

export default SessionsSearch;
