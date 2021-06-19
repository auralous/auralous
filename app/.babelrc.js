module.exports = {
  presets: [
    [
      "module:metro-react-native-babel-preset",
      { useTransformReactJSXExperimental: true },
    ],
  ],
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
          "@": "./src",
          "@auralous": "./src/@auralous",
        },
      },
    ],
    "react-native-reanimated/plugin",
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic",
      },
    ],
  ],
};
