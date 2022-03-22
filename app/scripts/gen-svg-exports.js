/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const prettier = require("prettier");

const files = fs
  .readdirSync("./src/assets/svg")
  .filter((filename) => filename.endsWith(".svg"));

let fileSvg = `// @ts-nocheck
import { wrapIcon } from "./wrapIcon";\n`;

for (const file of files) {
  const name = file.slice(0, -4);
  const ImportName = name
    .split("-")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join("");
  fileSvg += `import { default as ${ImportName} } from "./${file}";
export const Icon${ImportName} = wrapIcon(${ImportName});`;
}

fs.writeFileSync(
  "./src/assets/svg/svgs.gen.ts",
  prettier.format(fileSvg, { parser: "typescript" })
);
