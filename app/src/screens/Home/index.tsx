import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import type { ParamList, RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { useSessionCurrentLiveQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RequireEndSessionModal } from "../_commonContent/RequireEndSessionModal";
import HomeFeed from "./components/HomeFeed";

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: Size[2],
  },
  tab: {
    height: Size[8],
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Size[1],
    padding: Size[1],
  },
});

const HomeScreen: FC<NativeStackScreenProps<ParamList, RouteName.Home>> =
  () => {
    const [tab, setTab] = useState<"for_you" | "following">("for_you");

    const [{ data: dataSessionCurrentLive }] = useSessionCurrentLiveQuery({
      variables: { mine: true },
    });

    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.tabs}>
          <Button
            variant={tab === "for_you" ? "filled" : "text"}
            style={styles.tab}
            onPress={() => setTab("for_you")}
          >
            For You
          </Button>
          <Spacer x={2} />
          <Button
            variant={tab === "following" ? "filled" : "text"}
            style={styles.tab}
            onPress={() => setTab("following")}
          >
            Following
          </Button>
        </View>
        {dataSessionCurrentLive?.sessionCurrentLive?.sessionId ? (
          <RequireEndSessionModal
            visible={!!dataSessionCurrentLive?.sessionCurrentLive}
            sessionId={dataSessionCurrentLive?.sessionCurrentLive?.sessionId}
          />
        ) : (
          <>
            {tab === "following" ? (
              <HomeFeed isFollowing />
            ) : (
              <HomeFeed isFollowing={false} />
            )}
          </>
        )}
      </SafeAreaView>
    );
  };

export default HomeScreen;
