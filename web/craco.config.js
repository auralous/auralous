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
  // for every other package, loop through each of their peerDependencies and exclude it
  for (const packageDir of otherPackagesDir) {
    const otherPackageJson = require(path.join(packageDir, "package.json"));
    for (const dependencyName in otherPackageJson.peerDependencies) {
      const rDependencyName =
        dependencyName === "react-native" ? "react-native-web" : dependencyName;
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
        getDependencyDir("react-native-reanimated"),
        getDependencyDir("@auralous/ui"),
        getDependencyDir("@auralous/player"),
      ];
      return webpackConfig;
    },
  },
};
