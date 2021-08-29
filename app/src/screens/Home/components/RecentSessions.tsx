import { RouteName } from "@/screens/types";
import { useSessionsQuery } from "@auralous/api";
import { LoadingScreen, SessionItem, Size } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import scrollStyles from "./ScrollView.styles";

const styles = StyleSheet.create({
  root: {
    height: 296,
  },
  sessionItemWrapper: {
    marginRight: Size[4],
  },
});

const RecentSessions: FC = () => {
  const [{ data, fetching }] = useSessionsQuery({
    variables: { limit: 10 },
  });

  const navigation = useNavigation();

  return (
    <ScrollView
      style={[scrollStyles.scroll, styles.root]}
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
            style={styles.sessionItemWrapper}
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
