import { App } from "@auralous/app";
import { AppRegistry } from "react-native";
import "./styles/reset.css";
import "./styles/rnw.css";
import "./styles/styles.css";

// https://github.com/software-mansion/react-native-reanimated/pull/3418
global._frameTimestamp = null;

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});
