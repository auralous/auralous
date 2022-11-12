import RNConfig from "react-native-config";

const assert = <T extends Record<string, unknown>>(env: T) => {
  for (const envKey of Object.keys(env)) {
    if (env[envKey] === undefined)
      throw new Error(`Undefined config: ${envKey}`);
  }
  return env as {
    [key in keyof typeof env]: NonNullable<typeof env[key]>;
  };
};

const config = {
  API_URI: RNConfig.API_URI,
  APP_URI: RNConfig.APP_URI,
  WEBSOCKET_URI: RNConfig.WEBSOCKET_URI,
  SPOTIFY_CLIENT_ID: RNConfig.SPOTIFY_CLIENT_ID,
  FACEBOOK_APP_ID: RNConfig.FACEBOOK_APP_ID,
  WEB_URI: RNConfig.WEB_URI,
};

export const Config = assert(config);
