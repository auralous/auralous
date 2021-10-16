import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import type { FC } from "react";
import { Suspense } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Layout } from "./components/Layout";
import { LoadingScreen } from "./components/Loading";
import { RootModalsComponents } from "./components/RootModals";
import { Toaster } from "./components/Toast";
import { ApiProvider } from "./gql/context";
import { PlayerComponent, PlayerProvider } from "./player-components";
import { linking } from "./screens/linking";
import Navigator from "./screens/Navigator";
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
                <PlayerComponent>
                  <Layout>
                    <Suspense fallback={<LoadingScreen />}>
                      <Navigator />
                    </Suspense>
                  </Layout>
                </PlayerComponent>
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

export default App;
