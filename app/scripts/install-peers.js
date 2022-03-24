/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const path = require("path");

const pkgJsonPath = path.join(__dirname, "..", "package.json");
const packageJsonTxt = readFileSync(pkgJsonPath, {
  encoding: "UTF-8",
}).toString();
const packageJson = JSON.parse(packageJsonTxt);

let cmd = `yarn add --dev --frozen-lockfile --ignore-scripts `;

for (const [packageName, packageVer] of Object.entries(
  packageJson.peerDependencies
)) {
  cmd += `${packageName}@${packageVer} `;
}

console.log(cmd);
execSync(cmd);
