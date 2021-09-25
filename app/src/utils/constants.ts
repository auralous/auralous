export const STORAGE_KEY_SETTINGS_LANGUAGE = "settings/language";

import RNConfig from "react-native-config";

export const Config = {
  API_URI: RNConfig.API_URI,
  APP_URI: RNConfig.APP_URI,
  WEBSOCKET_URI: RNConfig.WEBSOCKET_URI,
  SPOTIFY_CLIENT_ID: RNConfig.SPOTIFY_CLIENT_ID,
  MAPBOX_ACCESS_TOKEN: RNConfig.MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_URL: RNConfig.MAPBOX_STYLE_URL,
};

export const supportedLanguages = ["en", "vi"];
