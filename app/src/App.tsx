import { ApiProvider } from "@/gql/context";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type { LinkingOptions } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import type { FC } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootModalsComponents } from "./components/RootModals";
import { Toaster } from "./components/Toast";
import { UIContextProvider } from "./context";
import { PlayerComponent, PlayerProvider } from "./player-component";
import Navigator from "./screens/Navigator";
import { Colors } from "./styles/colors";

const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: ["auralous://"],
  config: {
    screens: {
      [RouteName.SignIn]: "sign-in",
      [RouteName.User]: "user/:username",
      [RouteName.Playlist]: "playlist/:id",
      [RouteName.Session]: "session/:id",
      [RouteName.SessionCollaborators]: "session/:id/collaborators",
      [RouteName.SessionInvite]: "session/:id/invite/:token",
      [RouteName.SessionEdit]: "session/:id/edit",
    },
  },
};

const styles = StyleSheet.create({
  sap: {
    backgroundColor: Colors.background,
  },
});

const navigationTheme = {
  dark: true,
  colors: {
    background: Colors.background,
    card: Colors.background,
    border: Colors.border,
    primary: Colors.primary,
    text: Colors.text,
    notification: Colors.backgroundSecondary,
  },
};

const App: FC = () => {
  return (
    <ApiProvider>
      <PlayerProvider>
        <SafeAreaProvider style={styles.sap}>
          <StatusBar translucent backgroundColor="transparent" />
          <NavigationContainer theme={navigationTheme} linking={linking}>
            <UIContextProvider>
              <BottomSheetModalProvider>
                <PlayerComponent>
                  <Navigator />
                </PlayerComponent>
                <RootModalsComponents />
              </BottomSheetModalProvider>
            </UIContextProvider>
          </NavigationContainer>
          <Toaster />
        </SafeAreaProvider>
      </PlayerProvider>
    </ApiProvider>
  );
};

export default App;
