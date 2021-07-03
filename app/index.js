import { setImageSources } from "@auralous/ui";
import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { name as appName } from "./app.json";
import App from "./src/App";
import "./src/i18n";

setImageSources({
  defaultPlaylist: require("./src/assets/images/default_playlist.jpg"),
  defaultTrack: require("./src/assets/images/default_track.jpg"),
  defaultUser: require("./src/assets/images/default_user.jpg"),
});

AppRegistry.registerComponent(appName, () => App);
