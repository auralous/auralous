import { App } from "@auralous/app";
import { AppRegistry } from "react-native";
import "./styles/reset.css";
import "./styles/rnw.css";
import "./styles/styles.css";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});
