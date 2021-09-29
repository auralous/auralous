/* eslint-disable @typescript-eslint/no-var-requires */
const { createConfig } = require("webpack-config-react");
const pkgDir = require("pkg-dir");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const dotenvResult = require("dotenv").config();

const getDependencyDir = (name, options) =>
  pkgDir.sync(require.resolve(name, options));

module.exports = async (env, argv) => {
  const webpackConfig = await createConfig(
    argv.mode === "production" || env.production
  );
  webpackConfig.module.rules[0].include.push(getDependencyDir("@auralous/app"));

  const dotEnvEnv = dotenvResult.parsed;
  for (const envVal in dotEnvEnv) {
    dotEnvEnv[envVal] = JSON.stringify(dotEnvEnv[envVal]);
  }

  return merge(webpackConfig, {
    devServer: {
      port: 3000,
    },
    module: {
      rules: [
        {
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
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                native: true,
                svgoConfig: { plugins: { removeViewBox: false } },
              },
            },
          ],
        },
        {
          test: /\.(gif|jpe?g|png)$/,
          type: "asset/resource",
        },
        {
          test: /postMock.html$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        },
      ],
    },
    resolve: {
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
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV === "production",
        process: { env: { ...dotEnvEnv } },
      }),
    ],
  });
};
