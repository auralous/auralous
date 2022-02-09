/* eslint-disable @typescript-eslint/no-var-requires */
const { createConfig } = require("webpack-config-react");
const pkgDir = require("pkg-dir");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const dotenvResult = require("dotenv").config();
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const getDependencyDir = (name, options) =>
  pkgDir.sync(require.resolve(name, options));

const envNames = [
  "APP_URI",
  "API_URI",
  "WEBSOCKET_URI",
  "SPOTIFY_CLIENT_ID",
  "MAPBOX_ACCESS_TOKEN",
  "FACEBOOK_APP_ID",
];

module.exports = async (env, argv) => {
  const isProductionEnv = Boolean(argv.mode === "production" || env.production);
  const webpackConfig = await createConfig(isProductionEnv);
  webpackConfig.module.rules[0].include.push(
    getDependencyDir("@auralous/app"),
    getDependencyDir("@auralous/api")
  );

  const dotEnvEnv = dotenvResult.parsed || {};
  for (const envName of envNames) {
    dotEnvEnv[envName] = JSON.stringify(
      dotEnvEnv[envName] || process.env[envName]
    );
  }

  return merge(webpackConfig, {
    devtool: isProductionEnv ? "source-map" : "eval-source-map",
    devServer: {
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            getDependencyDir("@gorhom/bottom-sheet", {
              paths: [getDependencyDir("@auralous/app")],
            }),
          ],
          use: { loader: "babel-loader" },
        },
        {
          test: /\.js$/,
          include: [getDependencyDir("react-native-reanimated")],
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "module:metro-react-native-babel-preset",
                  { useTransformReactJSXExperimental: true, disableImportExportTransform: true },
                ],
              ],
              plugins: [
                "react-native-web",
                "react-native-reanimated/plugin",
                ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
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
                svgoConfig: {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(gif|jpe?g|png)$/,
          type: "asset/resource",
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
      ],
    },
    resolve: {
      alias: {
        react: getDependencyDir("react"),
        "react-native": "react-native-web",
        "react-native-linear-gradient": "react-native-web-linear-gradient",
        "react-native-reanimated": getDependencyDir("react-native-reanimated"),
        "react-native-gesture-handler": getDependencyDir("react-native-gesture-handler"),
        "@react-native-async-storage/async-storage": getDependencyDir(
          "@react-native-async-storage/async-storage"
        ),
        "@react-navigation/native": getDependencyDir(
          "@react-navigation/native"
        ),
        "@react-navigation/native-stack": getDependencyDir(
          "@react-navigation/native-stack"
        ),
        "@react-navigation/bottom-tabs": getDependencyDir(
          "@react-navigation/bottom-tabs"
        ),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV === "production",
        process: { env: { ...dotEnvEnv } },
      }),
      isProductionEnv && process.env.ANALYZE && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    optimization: {
      minimize: false
    }
  });
};
