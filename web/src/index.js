import { App } from "@auralous/app";
import "core-js/web/immediate";
import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import "./styles/reset.css";
import "./styles/rnw.css";
import "./styles/styles.css";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
