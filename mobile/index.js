import { App } from "@auralous/app";
import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
