/* eslint-disable @typescript-eslint/no-var-requires */
const pkgDir = require("pkg-dir");
const webpack = require("webpack");

const getDependencyDir = (name, options) =>
  pkgDir.sync(require.resolve(name, options));

module.exports = {
  babel: {
    presets: [],
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
          },
        },
      ],
      "react-native-web",
      "react-native-reanimated/plugin",
    ],
  },
  webpack: {
    alias: {
      react: getDependencyDir("react"),
      "react-native": "react-native-web",
      "react-native-linear-gradient": "react-native-web-linear-gradient",
      "react-native-webview": "react-native-web-webview",
      "react-native-reanimated": getDependencyDir("react-native-reanimated"),
      "@react-native-async-storage/async-storage": getDependencyDir(
        "@react-native-async-storage/async-storage"
      ),
    },

    plugins: {
      add: [
        new webpack.DefinePlugin({
          __DEV__: process.env.NODE_ENV === "production",
        }),
      ],
    },
    configure(webpackConfig) {
      webpackConfig.module.rules[1].oneOf[2].include = [
        webpackConfig.module.rules[1].oneOf[2].include,
        getDependencyDir("@auralous/app"),
      ];
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: [
          getDependencyDir("react-native-reanimated"),
          getDependencyDir("@gorhom/bottom-sheet", {
            paths: [getDependencyDir("@auralous/app")],
          }),
        ],
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              [
                "module:metro-react-native-babel-preset",
                { useTransformReactJSXExperimental: true },
              ],
            ],
            plugins: [
              "react-native-web",
              "react-native-reanimated/plugin",
              [
                "@babel/plugin-transform-react-jsx",
                {
                  runtime: "automatic",
                },
              ],
            ],
          },
        },
      });
      webpackConfig.module.rules.push({
        test: /postMock.html$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      });
      return webpackConfig;
    },
  },
};
