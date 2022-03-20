import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import type { FC } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Layout } from "./components/Layout";
import { RootModalsComponents } from "./components/RootModals";
import { Toaster } from "./components/Toast";
import { ApiProvider } from "./gql/context";
import { PlayerProvider } from "./player";
import { PlayerComponent, PlayerView } from "./player-components";
import Navigator, { linking } from "./screens/Navigator";
import { Colors } from "./styles/colors";
import { UIContextProvider } from "./ui-context";

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
  const navigationRef = useNavigationContainerRef();
  return (
    <UIContextProvider>
      <ApiProvider>
        <PlayerProvider navigationRef={navigationRef}>
          <SafeAreaProvider style={styles.sap}>
            <StatusBar translucent backgroundColor="transparent" />
            <NavigationContainer
              ref={navigationRef}
              theme={navigationTheme}
              linking={linking}
            >
              <BottomSheetModalProvider>
                <PlayerComponent />
                <Layout>
                  <Navigator />
                </Layout>
                <PlayerView />
                <RootModalsComponents />
              </BottomSheetModalProvider>
            </NavigationContainer>
            <Toaster />
          </SafeAreaProvider>
        </PlayerProvider>
      </ApiProvider>
    </UIContextProvider>
  );
};

export default gestureHandlerRootHOC(App);
