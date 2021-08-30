import { Toaster } from "@auralous/ui";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotFoundScreen } from "./components/NotFound";
import { ApiProvider } from "./gql/context";
import { PlayerProvider } from "./player";
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
import { SignInScreen } from "./screens/SignIn";
import {
  UserFollowersScreen,
  UserFollowingScreen,
  UserScreen,
} from "./screens/User";

const styles = StyleSheet.create({
  sap: {
    flex: 1,
  },
});

const App: FC = () => {
  return (
    <ApiProvider>
      <PlayerProvider>
        <SafeAreaProvider style={styles.sap}>
          <Router>
            <Switch>
              <Route path="/" exact component={HomeScreen} />
              <Route path="/map" exact component={MapScreen} />
              <Route path="/user/:id" exact component={UserScreen} />
              <Route
                path="/user/:id/followers"
                exact
                component={UserFollowersScreen}
              />
              <Route
                path="/user/:id/following"
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
              <Route
                path="/session/:id/invite"
                exact
                component={SessionInviteScreen}
              />
              <Route
                path="/session/:id/edit"
                exact
                component={SessionEditScreen}
              />
              <Route
                path="/session/:id/listeners"
                exact
                component={SessionListenersScreen}
              />
              <Route path="/sign-in" exact component={SignInScreen} />
              <Route
                path="/new/select-songs"
                exact
                component={NewSelectSongsScreen}
              />
              <Route path="/new/quick-share" exact component={NewFinalScreen} />
              <Route path="/new/final" exact component={NewQuickShareScreen} />
              <Route path="/settings" exact component={SettingsScreen} />
              <Route
                path="/notifications"
                exact
                component={NotificationScreen}
              />
              <Route path="*" component={NotFoundScreen} />
            </Switch>
          </Router>
          <Toaster />
        </SafeAreaProvider>
      </PlayerProvider>
    </ApiProvider>
  );
};

export default App;
