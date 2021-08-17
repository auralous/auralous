import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { name as appName } from "./app.json";
import App from "./src/App";
import "./src/assets/images/index";
import "./src/i18n";

AppRegistry.registerComponent(appName, () => App);
