import { App } from "@auralous/app";
import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { name as appName } from "./app.json";
import "./src/assets/images";
// import "./src/assets/images/index";

AppRegistry.registerComponent(appName, () => App);
