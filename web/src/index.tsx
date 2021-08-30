import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import App from "./App";
import "./assets/images/index";
import "./i18n";
import reportWebVitals from "./reportWebVitals";
import "./styles/rnw.css";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
