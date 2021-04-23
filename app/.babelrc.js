module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [
          ".ios.js",
          ".android.js",
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".json",
        ],
        alias: {
          "@": "./src"
        }
      },
    ],
    "react-native-reanimated/plugin"
  ],
};
