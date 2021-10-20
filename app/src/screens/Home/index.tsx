import { IconPlusSquare } from "@/assets";
import { Button } from "@/components/Button";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import { useSessionCurrentLiveQuery } from "@auralous/api";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RequireEndSessionModal } from "../_commonContent/RequireEndSessionModal";
import HomeFeed from "./components/HomeFeed";

const styles = StyleSheet.create({
  add: {
    paddingHorizontal: Size[2],
  },
  root: {
    flex: 1,
  },
  tab: {
    height: Size[8],
    paddingHorizontal: Size[2],
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

type TabName = "for_you" | "following";

const HeaderLeft: FC<{
  tab: TabName;
  setTab(tab: TabName): void;
}> = ({ tab, setTab }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.tabs}>
      <Button
        variant="text"
        style={styles.tab}
        onPress={() => setTab("for_you")}
        textProps={{
          color: tab === "following" ? "textTertiary" : "text",
        }}
      >
        {t("home.for_you")}
      </Button>
      <Button
        variant="text"
        style={styles.tab}
        onPress={() => setTab("following")}
        textProps={{
          color: tab === "for_you" ? "textTertiary" : "text",
        }}
      >
        {t("home.following")}
      </Button>
    </View>
  );
};

const HeaderRight: FC = () => {
  const { t } = useTranslation();
  const uiDispatch = useUiDispatch();

  return (
    <Button
      variant="text"
      icon={<IconPlusSquare />}
      accessibilityLabel={t("new.title")}
      onPress={() =>
        uiDispatch({ type: "newSession", value: { visible: true } })
      }
      style={styles.add}
    />
  );
};

const HomeScreen: FC<BottomTabScreenProps<ParamList, RouteName.Home>> = ({
  navigation,
}) => {
  const [tab, setTab] = useState<TabName>("for_you");

  const [{ data: dataSessionCurrentLive }] = useSessionCurrentLiveQuery({
    variables: { mine: true },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeftContainerStyle: {
        paddingHorizontal: Size[2],
      },
      headerRightContainerStyle: {
        paddingHorizontal: Size[2],
      },
      headerRight() {
        return <HeaderRight />;
      },
    });
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft() {
        return <HeaderLeft tab={tab} setTab={setTab} />;
      },
    });
  }, [tab, setTab, navigation]);

  return (
    <SafeAreaView style={styles.root}>
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
