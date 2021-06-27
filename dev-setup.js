import { watch } from "chokidar";
import { copyFileSync, existsSync, mkdirSync, rmdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const setup = (app, pkg) => {
  const downstreamDir = join(__dirname, `${app}/src/@auralous/${pkg}`);
  const upstreamDir = join(__dirname, `${pkg}/src`);
  console.log("Watching ", upstreamDir);
  if (existsSync(downstreamDir)) {
    rmdirSync(downstreamDir, { recursive: true });
  }
  watch(upstreamDir).on("all", (event, p) => {
    if (event === "addDir" || event === "unlinkDir") return;
    const dest = join(
      __dirname,
      `/${app}/src/@auralous/${pkg}${p.substring(upstreamDir.length)}`
    );
    const destDir = dirname(dest);
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
