import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildRegistry,
  parseIconLayout,
  renderIconSvg,
  validateNormalizedSvg,
} from "./icon-svg-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.resolve(__dirname, "../src/assets/icons");

function main() {
  const files = fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".svg"))
    .sort();
  const names = files.map((file) => file.replace(/\.svg$/, ""));

  for (const name of names) {
    const filePath = path.join(iconsDir, `${name}.svg`);
    const raw = fs.readFileSync(filePath, "utf8");
    const normalized = renderIconSvg(parseIconLayout(raw));
    validateNormalizedSvg(name, normalized);
    fs.writeFileSync(filePath, normalized);
    console.log(`✓ ${name}`);
  }

  fs.writeFileSync(
    path.join(iconsDir, "registry.ts"),
    buildRegistry(names, iconsDir, fs),
  );

  console.log(`\nReprocessed ${names.length} icons → registry.ts`);
}

main();
