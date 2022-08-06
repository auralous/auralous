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
        alias: {
          "@": "../app/src",
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
