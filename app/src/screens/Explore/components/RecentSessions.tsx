import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { LoadingScreen } from "@/components/Loading";
import { SessionItem } from "@/components/Session";
import { RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { memo, useCallback } from "react";
import type { ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";
import scrollStyles from "./ScrollView.styles";

const TouchableSessionItem = memo<{ session: Session; style: ViewStyle }>(
  function TouchableSessionItem({ session, style }) {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        key={session.id}
        style={style}
        onPress={() =>
          navigation.navigate(RouteName.Session, { id: session.id })
        }
      >
        <SessionItem session={session} />
      </TouchableOpacity>
    );
  }
);

const RecentSessions: FC = () => {
  const [{ data, fetching }] = useSessionsQuery({
    variables: { limit: 10 },
  });

  const renderItem = useCallback<HorizontalListProps<Session>["renderItem"]>(
    (info) => (
      <TouchableSessionItem
        key={info.item.id}
        session={info.item}
        style={info.style}
      />
    ),
    []
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
