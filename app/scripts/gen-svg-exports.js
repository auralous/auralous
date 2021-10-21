/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const prettier = require("prettier");

const files = fs
  .readdirSync("./src/assets/svg")
  .filter((filename) => filename.endsWith(".svg"));

let fileExport = ``;
let fileSvg = `// @ts-nocheck
import { wrapIcon } from "./wrapIcon";\n`;

for (const file of files) {
  const name = file.slice(0, -4);
  const ImportName = name
    .split("-")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join("");
  fileExport += `export { default as ${ImportName} } from "./${file}";\n`;
  fileSvg += `import { ${ImportName} } from "./exports";
export const Icon${ImportName} = wrapIcon(${ImportName});`;
}

fs.writeFileSync(
  "./src/assets/svg/exports.ts",
  prettier.format(fileExport, { parser: "typescript" })
);
fs.writeFileSync(
  "./src/assets/svg/svgs.ts",
  prettier.format(fileSvg, { parser: "typescript" })
);
