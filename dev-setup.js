import { watch } from "chokidar";
import { copyFileSync, existsSync, mkdirSync, rmdirSync } from "fs";
import { dirname } from "path";

const setup = (app, pkg) => {
  const downstreamDir = `./${app}/src/@auralous/${pkg}`;
  if (existsSync(downstreamDir)) {
    rmdirSync(downstreamDir, { recursive: true });
  }
  watch(`./${pkg}/src`).on("all", (event, p) => {
    if (event === "addDir" || event === "unlinkDir") return;
    const dest = `./${app}/src/@auralous/${p.replace("src/", "")}`;
    const destDir = dirname(dest);
    if (destDir === p) return;
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
    if (event === "unlink") {
      console.log(`${p} ==> REMOVED`);
    } else {
      copyFileSync(p, dest);
      console.log(`${p} ==> ${destDir}`);
    }
  });
};

setup("app", "ui");
setup("app", "api");
setup("app", "player");
setup("app", "locales");
