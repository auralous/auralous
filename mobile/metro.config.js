/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require("metro-config");
const path = require("path");
const getWorkspaces = require("get-yarn-workspaces");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const pkgDir = require("pkg-dir");

const rootDir = path.resolve(__dirname, "..");
const currDir = __dirname;
const packageDirs = getWorkspaces(rootDir).filter((dir) => {
  return dir !== currDir && dir !== path.join(rootDir, "web");
});

const buildModuleLists = () => {
  const blockList = [];
  const extraNodeModules = {};
  // loop through each package dir
  for (const dir of packageDirs) {
    const dirPackageJson = require(path.join(dir, "package.json"));
    for (const depName in dirPackageJson.peerDependencies) {
      // force metro to not resolve this version
      // and instead the one in "extraNodeModules"
      blockList.push(new RegExp(`${dir}/node_modules/${depName}/.*`));
      // since the above module would not be found if resolved as it,
      // we need to tell it to look for the version that the current package use
      // we use require.resolve to look for two places (current node_modules or root node_module)
      const resolvedDepFile = require.resolve(depName, {
        paths: [currDir, rootDir],
      });
      // resolvedDepFile is not neccessary the package parent dir of that dep (might be the index.js file, so we use pkgDir to find the, well, package dir)
      extraNodeModules[depName] = pkgDir.sync(resolvedDepFile);
    }
  }
  return {
    blockList,
    extraNodeModules,
  };
};

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  const { blockList, extraNodeModules } = buildModuleLists();

  return {
    watchFolders: [path.resolve(rootDir, "node_modules"), ...packageDirs],
    transformer: {
      experimentalImportSupport: true,
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      blockList: exclusionList(blockList),
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
      extraNodeModules,
    },
  };
})();
