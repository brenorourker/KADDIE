import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateNormalizedSvg } from "./icon-svg-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.resolve(__dirname, "../src/assets/icons");

const files = fs
  .readdirSync(iconsDir)
  .filter((file) => file.endsWith(".svg"))
  .sort();

for (const file of files) {
  const name = file.replace(/\.svg$/, "");
  const svg = fs.readFileSync(path.join(iconsDir, file), "utf8");
  validateNormalizedSvg(name, svg);
}

console.log(`Validated ${files.length} icons.`);
