/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require("metro-config");
const path = require("path");
const getWorkspaces = require("get-yarn-workspaces");
const packageJson = require("./package.json");
const exclusionList = require("metro-config/src/defaults/exclusionList");
const pkgDir = require("pkg-dir");

const appDir = __dirname;

const workspaces = getWorkspaces(appDir);
const otherPackagesDir = workspaces.filter(
  (workspaceDir) => workspaceDir !== appDir
);

const buildExtraNodeModules = () => {
  const extraNodeModules = {};
  // force the dependency to be resolved using the version inside app/node_modules
  for (const dependencyName in packageJson.dependencies) {
    if (dependencyName.startsWith("@auralous")) continue;
    extraNodeModules[dependencyName] = pkgDir.sync(
      require.resolve(dependencyName)
    );
  }
  return extraNodeModules;
};

const buildBlocklist = () => {
  const list = [];
  // for every other package, loop through each of their peerDependencies and exclude it
  for (const packageDir of otherPackagesDir) {
    const packageName = packageDir.substring(packageDir.lastIndexOf("/") + 1); // get the package name
    const otherPackageJson = require(path.join(packageDir, "package.json"));
    for (const dependencyName in otherPackageJson.peerDependencies) {
      list.push(
        new RegExp(
          `${packageName}[/\\\\]node_modules[/\\\\]${dependencyName}[/\\\\].*`
        )
      );
    }
  }
  return list;
};

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    watchFolders: [
      path.resolve(appDir, "..", "node_modules"),
      ...otherPackagesDir,
    ],
    transformer: {
      experimentalImportSupport: true,
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      blacklistRE: exclusionList(buildBlocklist()),
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
      extraNodeModules: buildExtraNodeModules(),
    },
  };
})();
