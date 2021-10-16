import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { LoadingScreen } from "@/components/Loading";
import { SessionItem } from "@/components/Session";
import { RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import scrollStyles from "./ScrollView.styles";

const RecentSessions: FC = () => {
  const navigation = useNavigation();

  const [{ data, fetching }] = useSessionsQuery({
    variables: { limit: 10 },
  });

  const renderItem = useCallback<HorizontalListProps<Session>["renderItem"]>(
    (info) => (
      <TouchableOpacity
        key={info.item.id}
        style={info.style}
        onPress={() =>
          navigation.navigate(RouteName.Session, { id: info.item.id })
        }
      >
        <SessionItem session={info.item} />
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <HorizontalList
      style={scrollStyles.scroll}
      contentContainerStyle={scrollStyles.scrollContent}
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      data={data?.sessions}
      renderItem={renderItem}
    />
  );
};

export default RecentSessions;
