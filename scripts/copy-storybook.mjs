import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

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
}

main();
