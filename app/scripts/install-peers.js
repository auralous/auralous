/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require("../package.json");
const { execSync } = require("child_process");

if (process.env.NODE_ENV === "production") return;

let cmd = `yarn add --dev --ignore-scripts `;

for (const [packageName, packageVer] of Object.entries(
  packageJson.peerDependencies
)) {
  cmd += `${packageName}@${packageVer} `;
}

console.log(cmd);
execSync(cmd);
