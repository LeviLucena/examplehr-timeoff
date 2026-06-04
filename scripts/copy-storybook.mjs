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

  // Storybook generates absolute paths like /sb-addons/..., /sb-manager/..., /assets/...
  // Rewrite them to relative paths so they work from /storybook/ subdirectory
  for (const file of ["index.html", "iframe.html"]) {
    const filePath = join(dest, file);
    if (!existsSync(filePath)) continue;
    let html = await readFile(filePath, "utf-8");
    html = html.replace(/(src|href)="\//g, '$1="/storybook/');
    await writeFile(filePath, html, "utf-8");
    console.log(`Rewrote paths in ${file} from absolute to /storybook/ prefixed`);
  }
}

main();
