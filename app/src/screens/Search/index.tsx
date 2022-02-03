import { IconSearch } from "@/assets";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { Size } from "@/styles/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { ParamList, RouteName } from "../types";
import PlaylistsSearch from "./components/PlaylistsSearch";
import SessionsSearch from "./components/SessionsSearch";
import Tabs from "./components/Tabs";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Size[6],
    paddingTop: Size[3],
  },
  root: {
    flex: 1,
  },
});

const SearchScreen: FC<NativeStackScreenProps<ParamList, RouteName.Search>> = ({
  route,
  navigation,
}) => {
  const [tab, setTab] = useState<"playlists" | "sessions">("playlists");

  const currentQuery = route.params.query;

  const { t } = useTranslation();

  const ref = useRef<InputRef>(null);

  useEffect(() => {
    ref.current?.setValue(currentQuery);
  }, [currentQuery]);

  const onSubmit = useCallback(() => {
    const query = ref.current?.value.trim();
    if (!query) return;
    navigation.setParams({ query });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Container style={styles.container}>
        <View style={styles.content}>
          <Input
            onSubmit={onSubmit}
            ref={ref}
            placeholder={t("search.placeholder")}
            endIcon={
              <Button
                accessibilityLabel={t("search.title")}
                icon={<IconSearch />}
                onPress={onSubmit}
              />
            }
          />
          <Spacer y={3} />
          <Tabs tab={tab} setTab={setTab} />
          <Spacer y={2} />
          {tab === "playlists" && <PlaylistsSearch query={currentQuery} />}
          {tab === "sessions" && <SessionsSearch query={currentQuery} />}
        </View>
      </Container>
    </View>
  );
};

export default SearchScreen;
