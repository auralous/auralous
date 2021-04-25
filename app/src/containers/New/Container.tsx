import { useNavigation } from "@react-navigation/core";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import CreateFinal from "./CreateFinal";
import ModeSelector from "./ModeSelector";
import SelectSongs from "./SelectSongs";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const CreateSelect: React.FC = () => {
  const { t } = useTranslation();

  const [mode, setMode] = useState<null | "select" | "quick">(null);
  const navigation = useNavigation();

  const onSelect = useCallback(
    (selectedTracks: string[]) => {
      navigation.navigate("new/final", {
        selectedTracks,
        modeTitle: t(
          mode === "select" ? "new.select_songs.title" : "new.quick_share.title"
        ),
      });
    },
    [navigation, t, mode]
  );

  return (
    <View style={styles.root}>
      {mode === "select" ? (
        <SelectSongs onFinish={onSelect} />
      ) : mode === "quick" ? null : (
        <ModeSelector setMode={setMode} />
      )}
    </View>
  );
};

const Stack = createStackNavigator();

const Container: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="new/select" component={CreateSelect} />
      <Stack.Screen name="new/final" component={CreateFinal} />
    </Stack.Navigator>
  );
};

export default Container;
