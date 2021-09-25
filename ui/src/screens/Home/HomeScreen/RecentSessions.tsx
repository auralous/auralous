import {
  LoadingScreen,
  SessionItem,
  useLargeItemHortizontalWidthStyle,
} from "@/components";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles";
import { useSessionsQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import scrollStyles from "./ScrollView.styles";

const styles = StyleSheet.create({
  item: {
    marginRight: Size[4],
  },
});

const RecentSessions: FC = () => {
  const navigation = useNavigation();

  const [{ data, fetching }] = useSessionsQuery({
    variables: { limit: 10 },
  });

  const widthStyle = useLargeItemHortizontalWidthStyle();

  return (
    <ScrollView
      style={scrollStyles.scroll}
      contentContainerStyle={scrollStyles.scrollContent}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {fetching ? (
        <LoadingScreen />
      ) : (
        data?.sessions?.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={[styles.item, widthStyle]}
            onPress={() =>
              navigation.navigate(RouteName.Session, { id: session.id })
            }
          >
            <SessionItem session={session} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default RecentSessions;
