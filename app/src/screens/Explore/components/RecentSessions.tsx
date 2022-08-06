import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { RNLink } from "@/components/Link";
import { LoadingScreen } from "@/components/Loading";
import { ResultEmptyScreen } from "@/components/Result";
import { SessionItem } from "@/components/Session";
import { RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import type { FC } from "react";
import { memo, useCallback } from "react";
import type { ViewStyle } from "react-native";
import scrollStyles from "./ScrollView.styles";

const TouchableSessionItem = memo<{ session: Session; style: ViewStyle }>(
  function TouchableSessionItem({ session, style }) {
    return (
      <RNLink
        key={session.id}
        style={style}
        to={{
          screen: RouteName.Session,
          params: { id: session.id },
        }}
      >
        <SessionItem session={session} />
      </RNLink>
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
      ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
      data={data?.sessions}
      renderItem={renderItem}
    />
  );
};

export default RecentSessions;
