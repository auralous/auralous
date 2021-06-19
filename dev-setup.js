import { watch } from "chokidar";
import { copyFileSync, existsSync, mkdirSync, rmdirSync } from "fs";
import { dirname } from "path";

const setup = (app, pkg) => {
  const downstreamDir = `./${app}/src/@auralous/${pkg}`;
  if (existsSync(downstreamDir)) {
    rmdirSync(downstreamDir, { recursive: true });
  }
  watch(`./${pkg}/src`).on("all", (_, p) => {
    if (p.indexOf(".") === -1) return;
    const dest = `./${app}/src/@auralous/${p.replace("src/", "")}`;
    const destDir = dirname(dest);
    if (destDir === p) return;
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
    copyFileSync(p, dest);
    console.log(`${p} ==> ${destDir}`);
  });
};

setup("app", "ui");
setup("app", "api");
setup("app", "player");
setup("app", "locales");
