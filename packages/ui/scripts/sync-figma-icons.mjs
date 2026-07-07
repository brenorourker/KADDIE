import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildRegistry,
  normalizeSvg,
  validateNormalizedSvg,
} from "./icon-svg-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.resolve(__dirname, "../src/assets/icons");

/** Figma node 45:42 — asset URLs from get_design_context (2026-07-01) */
const FIGMA_ICONS = {
  "chevron-right":
    "https://www.figma.com/api/mcp/asset/8f2462d5-34c0-4e1c-8faa-2152a24b2517",
  "chevron-left":
    "https://www.figma.com/api/mcp/asset/c854a943-034f-4025-8441-170bb7637d81",
  "chevron-down":
    "https://www.figma.com/api/mcp/asset/837fc244-cfc1-419a-9e11-12a320bc0b26",
  "chevron-up":
    "https://www.figma.com/api/mcp/asset/b905f355-35b6-45a3-a149-a7f2933db661",
  close: "https://www.figma.com/api/mcp/asset/ff61072e-8f21-4894-8f66-535b6147a3fe",
  plus: "https://www.figma.com/api/mcp/asset/23784552-33de-4c56-9ecd-7c855a713b89",
  minus: "https://www.figma.com/api/mcp/asset/71e72994-b719-4eff-800b-1db02dde909d",
  check: "https://www.figma.com/api/mcp/asset/c44583a6-dd98-491a-8f27-5dfcf37eb1fe",
  menu: "https://www.figma.com/api/mcp/asset/0ae06cfa-fc02-41f0-98c5-69766f07a39b",
  more: "https://www.figma.com/api/mcp/asset/0c33f745-2526-4c88-b719-be3dbb855210",
  search: "https://www.figma.com/api/mcp/asset/31c7f8b0-0b42-43cf-b7ba-a7aed2f5be37",
  home: "https://www.figma.com/api/mcp/asset/c1cc5ec9-4a14-4956-864b-e5979683089e",
  settings: "https://www.figma.com/api/mcp/asset/f6bed527-3d16-4663-acc9-d16d5f570f3b",
  profile: "https://www.figma.com/api/mcp/asset/480163f1-ccf0-40f6-b65d-8a93232d8210",
  wind: "https://www.figma.com/api/mcp/asset/8473a5cb-b6d0-45f9-96ba-fc03628eabc9",
  "target-1":
    "https://www.figma.com/api/mcp/asset/634d7025-fcc8-4886-8c2e-516c702fe76d",
  "target-2":
    "https://www.figma.com/api/mcp/asset/cd672725-47ed-4702-9209-86a5701c6c3b",
  "target-3":
    "https://www.figma.com/api/mcp/asset/c0d9a613-087a-474b-9e3-c2b26b9234dd",
  "target-4":
    "https://www.figma.com/api/mcp/asset/8bda8d91-c814-4d4e-9369-dae541550af7",
  play: "https://www.figma.com/api/mcp/asset/16e8b15d-1d71-4cbb-b63b-f9fb9ad3e88e",
  flag: "https://www.figma.com/api/mcp/asset/298f1511-8d2c-4371-974f-b042da34322d",
  "caret-down":
    "https://www.figma.com/api/mcp/asset/9341a340-f6ab-4db8-bc01-be307d982fef",
  "caret-up":
    "https://www.figma.com/api/mcp/asset/30d4bded-020e-4dd4-9c86-0886158f81b4",
  "expand-up":
    "https://www.figma.com/api/mcp/asset/eacc273d-5bb4-4959-b3bf-8c99f423fd0e",
  "close-down":
    "https://www.figma.com/api/mcp/asset/deb98254-1f5a-44ff-8bb9-518dd93d4103",
  microphone:
    "https://www.figma.com/api/mcp/asset/cdcfe4a9-b701-445c-b0d5-2eacece3f373",
  text: "https://www.figma.com/api/mcp/asset/5b444c6a-732b-4dd3-bb96-27c1788dca90",
  pin: "https://www.figma.com/api/mcp/asset/8e046cd4-4e3c-44ed-bf4a-ab27287f53a4",
  scorecard:
    "https://www.figma.com/api/mcp/asset/02b17045-0775-4986-9008-3e7b366fcf47",
};

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.text();
}

async function main() {
  const names = Object.keys(FIGMA_ICONS).sort();

  for (const name of names) {
    const raw = await download(FIGMA_ICONS[name]);
    const normalized = normalizeSvg(raw);
    validateNormalizedSvg(name, normalized);
    fs.writeFileSync(path.join(iconsDir, `${name}.svg`), normalized);
    console.log(`✓ ${name}`);
  }

  const legacyMessage = path.join(iconsDir, "message.svg");
  if (fs.existsSync(legacyMessage)) fs.unlinkSync(legacyMessage);

  fs.writeFileSync(
    path.join(iconsDir, "registry.ts"),
    buildRegistry(names, iconsDir, fs),
  );

  console.log(`\nSynced ${names.length} icons → registry.ts`);
  console.log("Run validate-icons to verify the icon set.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
