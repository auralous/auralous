/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const pkgDir = require("pkg-dir");
const getWorkspaces = require("get-yarn-workspaces");

const appDir = __dirname;

const workspaces = getWorkspaces(appDir);
const otherPackagesDir = workspaces.filter(
  (workspaceDir) => workspaceDir !== appDir
);

const getDependencyDir = (name) => pkgDir.sync(require.resolve(name));

const createWebpackAlias = () => {
  const list = {};
  // for every other package, loop through each of their peerDependencies and
  // force it to use a single instance
  for (const packageDir of otherPackagesDir) {
    const otherPackageJson = require(path.join(packageDir, "package.json"));
    for (const dependencyName in otherPackageJson.peerDependencies) {
      let rDependencyName = dependencyName;
      if (dependencyName === "react-native")
        rDependencyName = "react-native-web";
      if (dependencyName === "react-native-linear-gradient")
        rDependencyName = "react-native-web-linear-gradient";
      list[dependencyName] = getDependencyDir(rDependencyName);
    }
  }
  return list;
};

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
    alias: createWebpackAlias(),
    configure(webpackConfig) {
      webpackConfig.module.rules[1].oneOf[2].include = [
        webpackConfig.module.rules[1].oneOf[2].include,
        getDependencyDir("@auralous/app"),
      ];
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: [getDependencyDir("react-native-reanimated")],
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
      return webpackConfig;
    },
  },
};
