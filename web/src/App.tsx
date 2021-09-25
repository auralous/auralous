import { Toaster } from "@auralous/ui";
import type { FC } from "react";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotFoundScreen } from "./components/NotFound";
import { ApiProvider } from "./gql/context";
import { PlayerComponent, PlayerProvider } from "./player";
import { HomeScreen } from "./screens/Home";
import { MapScreen } from "./screens/Map";
import {
  NewFinalScreen,
  NewQuickShareScreen,
  NewSelectSongsScreen,
} from "./screens/New";
import { NotificationScreen } from "./screens/Notification";
import { PlaylistScreen } from "./screens/Playlist";
import {
  SessionCollaboratorsScreen,
  SessionEditScreen,
  SessionInviteScreen,
  SessionListenersScreen,
  SessionScreen,
} from "./screens/Session";
import { SettingsScreen } from "./screens/Settings";
import { UIContextProviderWithRouter } from "./screens/UIProviderWithRouter";
import {
  UserFollowersScreen,
  UserFollowingScreen,
  UserScreen,
} from "./screens/User";
import { RootViews } from "./views/RootViews";

const styles = StyleSheet.create({
  sap: {
    flex: 1,
  },
});

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={HomeScreen} />
      <Route path="/map" exact component={MapScreen} />
      <Route path="/user/:username" exact component={UserScreen} />
      <Route
        path="/user/:username/followers"
        exact
        component={UserFollowersScreen}
      />
      <Route
        path="/user/:username/following"
        exact
        component={UserFollowingScreen}
      />
      <Route path="/playlist/:id" exact component={PlaylistScreen} />
      <Route path="/session/:id" exact component={SessionScreen} />
      <Route
        path="/session/:id/collaborators"
        exact
        component={SessionCollaboratorsScreen}
      />
      <Route path="/session/:id/invite" exact component={SessionInviteScreen} />
      <Route path="/session/:id/edit" exact component={SessionEditScreen} />
      <Route
        path="/session/:id/listeners"
        exact
        component={SessionListenersScreen}
      />
      <Route path="/new/select-songs" exact component={NewSelectSongsScreen} />
      <Route path="/new/quick-share" exact component={NewFinalScreen} />
      <Route path="/new/final" exact component={NewQuickShareScreen} />
      <Route path="/settings" exact component={SettingsScreen} />
      <Route path="/notifications" exact component={NotificationScreen} />
      <Route path="*" component={NotFoundScreen} />
    </Switch>
  );
};

const App: FC = () => {
  const ref = useRef<BrowserRouter>(null);
  return (
    <ApiProvider>
      <PlayerProvider>
        <SafeAreaProvider style={styles.sap}>
          <Router ref={ref}>
            <UIContextProviderWithRouter>
              <RootViews />
              <Layout>
                <PlayerComponent>
                  <Routes />
                </PlayerComponent>
              </Layout>
            </UIContextProviderWithRouter>
          </Router>
          <Toaster />
        </SafeAreaProvider>
      </PlayerProvider>
    </ApiProvider>
  );
};

export default App;
