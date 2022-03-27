import { Spacer } from "@/components/Spacer";
import { Tab, TabList, TabPanel, Tabs } from "@/components/Tab";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import FollowingFeed from "./components/FollowingFeed";
import NearFeed from "./components/NearFeed";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Size[2],
  },
  tabList: {
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
});

const FeedScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Feed>
> = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Tabs>
        <TabList style={styles.tabList}>
          <Tab>{t("feed.following.title")}</Tab>
          <Tab>{t("feed.near.title")}</Tab>
        </TabList>
        <Spacer y={2} />
        <TabPanel>
          <FollowingFeed />
        </TabPanel>
        <TabPanel>
          <NearFeed />
        </TabPanel>
      </Tabs>
    </View>
  );
};

export default FeedScreen;
