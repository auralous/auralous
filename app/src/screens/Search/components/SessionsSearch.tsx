import { LoadingScreen } from "@/components/Loading";
import { SessionItem } from "@/components/Session";
import { Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { useUILayout } from "@/ui-context/UIContext";
import type { Session } from "@auralous/api";
import { useSessionsSearchQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./ItemsSearch.styles";

const SearchItem: FC<{ session: Session }> = ({ session }) => {
  const navigation = useNavigation();
  const uiNumColumn = useUILayout().column6432;
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
  <SearchItem session={item} key={item.id} />
);

const SessionsSearch: FC<{ query: string }> = ({ query }) => {
  const { t } = useTranslation();
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
      numColumns={numColumns}
      ListEmptyComponent={
        fetching ? (
          <LoadingScreen />
        ) : (
          <Text color="textSecondary" align="center">
            {t("common.result.search_empty")}
          </Text>
        )
      }
    />
  );
};

export default SessionsSearch;
