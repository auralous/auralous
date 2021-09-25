/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require("metro-config");
const path = require("path");
const packageJson = require("./package.json");
const appPackageJson = require("../app/package.json");
const exclusionList = require("metro-config/src/defaults/exclusionList");
const pkgDir = require("pkg-dir");

const appDir = path.resolve(__dirname, "..", "app");
const otherDirs = [
  path.resolve(__dirname, "..", "ui"),
  path.resolve(__dirname, "..", "player"),
  path.resolve(__dirname, "..", "api"),
];

const buildExtraNodeModules = () => {
  const extraNodeModules = {};
  // force the dependency to be resolved using the version inside app/node_modules

  const allDependencies = [
    ...new Set([
      ...Object.keys(packageJson.dependencies),
      ...Object.keys(appPackageJson.dependencies),
    ]),
  ];

  for (const dependencyName of allDependencies) {
    if (dependencyName.startsWith("@auralous")) continue;

    const depDir = require.resolve(dependencyName, {
      paths: [__dirname, appDir, path.resolve(__dirname, "..")],
    });

    extraNodeModules[dependencyName] = pkgDir.sync(depDir);
  }
  return extraNodeModules;
};

const buildBlocklist = () => {
  const list = [];
  // for every other package, loop through each of their peerDependencies and exclude it
  for (const dir of [...otherDirs, appDir]) {
    const packageName = dir.substring(dir.lastIndexOf("/") + 1); // get the package name

    const otherPackageJson = require(path.join(dir, "package.json"));

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
  const extraNodeModules = buildExtraNodeModules();
  const blockList = buildBlocklist();
  console.log({ extraNodeModules, blockList });
  return {
    watchFolders: [
      path.resolve(__dirname, "..", "node_modules"),
      appDir,
      ...otherDirs,
    ],
    transformer: {
      experimentalImportSupport: true,
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      blacklistRE: exclusionList(blockList),
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
      extraNodeModules,
    },
  };
})();
