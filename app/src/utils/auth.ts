import { Linking } from "react-native";
import Config from "react-native-config";

export const openLoginLink = () =>
  Linking.openURL(`${Config.API_URI}/app-login`);
