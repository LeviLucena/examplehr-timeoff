import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const src = "storybook-static";
  const dest = "public/storybook";

  if (!existsSync(src)) {
    console.error("storybook-static not found — run build-storybook first");
    process.exit(1);
  }

  if (!existsSync("public")) {
    await mkdir("public");
  }

  await cp(src, dest, { recursive: true });
  console.log(`Copied ${src} -> ${dest}`);

  // Fix paths in index.html so Storybook works from /storybook/ subdirectory
  const indexPath = join(dest, "index.html");
  let html = await readFile(indexPath, "utf-8");

  // Storybook generates absolute paths like /sb-addons/..., /sb-manager/..., /assets/...
  // Rewrite them relative to /storybook/ subdirectory
  html = html.replace(
    /(src|href)=["']\//g,
    '$1="/storybook/'
  );

  await writeFile(indexPath, html, "utf-8");
  console.log("Fixed paths in index.html for /storybook/ subdirectory");
}

main();
