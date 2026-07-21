/**
 * Normalizes Figma-exported SVG icons for react-native-svg.
 *
 * Figma boolean shapes export as compound paths (`…ZM…`). Those must use
 * `fill-rule="evenodd"`. Splitting them into separate filled paths creates solid
 * silhouettes (search, profile, targets, etc.).
 */

export function round(n) {
  return Math.round(n * 10000) / 10000;
}

export function parseViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) return { x: 0, y: 0, w: 24, h: 24 };
  return parseViewBoxString(match[1]);
}

function parseViewBoxString(viewBox) {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  if (parts.length === 4) {
    return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
  }
  if (parts.length === 2) {
    return { x: 0, y: 0, w: parts[0], h: parts[1] };
  }
  return { x: 0, y: 0, w: 24, h: 24 };
}

export function extractPaths(svg) {
  const paths = [];
  const pathRegex = /<path\b[^>]*\sd="([^"]+)"/g;
  let match;
  while ((match = pathRegex.exec(svg)) !== null) {
    paths.push(match[1]);
  }
  return paths;
}

function cleanPathD(d) {
  return d
    .replace(/\s*Z\s*Z\s*/gi, " Z ")
    .replace(/\s*M\s*M\s*/gi, " M ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCompoundSeparators(d) {
  return cleanPathD(d).replace(/\s*Z\s+M\s+/gi, "ZM");
}

export function splitZmSubpaths(d) {
  const normalized = normalizeCompoundSeparators(d);
  if (!normalized.includes("ZM")) return [normalized];
  const parts = normalized.split("ZM");
  return parts.map((part, index) => {
    let pathData =
      index === 0 ? part : part.trimStart().startsWith("M") ? part : `M${part}`;
    pathData = pathData.trim();
    if (pathData && !/[zZ]$/.test(pathData)) pathData += "Z";
    return pathData;
  });
}

const COMMAND_LENGTHS = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

export function approximateBBox(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let i = 0;
  let cx = 0;
  let cy = 0;
  let startX = 0;
  let startY = 0;

  const addPoint = (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    cx = x;
    cy = y;
  };

  while (i < tokens.length) {
    const token = tokens[i++];
    const upper = token.toUpperCase();
    const relative = token !== upper;
    const count = COMMAND_LENGTHS[upper];

    if (upper === "Z") {
      cx = startX;
      cy = startY;
      continue;
    }

    if (count === undefined) continue;

    if (upper === "H") {
      for (let p = 0; p < count; p++) {
        const value = parseFloat(tokens[i++]);
        addPoint(relative ? cx + value : value, cy);
      }
      continue;
    }

    if (upper === "V") {
      for (let p = 0; p < count; p++) {
        const value = parseFloat(tokens[i++]);
        addPoint(cx, relative ? cy + value : value);
      }
      continue;
    }

    for (let p = 0; p < count; p += 2) {
      const x = parseFloat(tokens[i++]);
      const y = parseFloat(tokens[i++]);
      const px = relative ? cx + x : x;
      const py = relative ? cy + y : y;
      addPoint(px, py);
      if (upper === "M" && p === 0) {
        startX = px;
        startY = py;
      }
    }
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return { minX, minY, maxX, maxY };
}

function bboxArea(bbox) {
  return Math.max(0, bbox.maxX - bbox.minX) * Math.max(0, bbox.maxY - bbox.minY);
}

function bboxCenter(bbox) {
  return {
    x: (bbox.minX + bbox.maxX) / 2,
    y: (bbox.minY + bbox.maxY) / 2,
  };
}

function isContained(inner, outer) {
  return (
    inner.minX >= outer.minX - 0.5 &&
    inner.maxX <= outer.maxX + 0.5 &&
    inner.minY >= outer.minY - 0.5 &&
    inner.maxY <= outer.maxY + 0.5
  );
}

function centersMatch(a, b, tolerance = 1.5) {
  const ca = bboxCenter(a);
  const cb = bboxCenter(b);
  return (
    Math.abs(ca.x - cb.x) <= tolerance && Math.abs(ca.y - cb.y) <= tolerance
  );
}

function shouldSplitZmSubpaths(subpaths) {
  if (subpaths.length < 2) return false;

  const bboxes = subpaths.map(approximateBBox);

  for (let i = 0; i < bboxes.length; i++) {
    for (let j = 0; j < bboxes.length; j++) {
      if (i === j) continue;
      const inner =
        bboxArea(bboxes[i]) < bboxArea(bboxes[j]) ? bboxes[i] : bboxes[j];
      const outer =
        bboxArea(bboxes[i]) < bboxArea(bboxes[j]) ? bboxes[j] : bboxes[i];
      if (
        bboxArea(inner) > 0 &&
        bboxArea(outer) > bboxArea(inner) * 1.1 &&
        isContained(inner, outer) &&
        centersMatch(inner, outer)
      ) {
        return false;
      }
    }
  }

  return true;
}

function stripTrailingZ(d) {
  return cleanPathD(d).replace(/[zZ]\s*$/, "");
}

function joinCompoundPath(parts) {
  return (
    parts
      .map((part, index) => {
        const stripped = stripTrailingZ(part);
        return index === 0 ? stripped : stripped.replace(/^M\s*/i, "");
      })
      .join(" Z M ") + " Z"
  );
}

function processSinglePath(d) {
  const cleaned = normalizeCompoundSeparators(d);

  if (!cleaned.includes("ZM")) {
    return [{ d: cleanPathD(d), evenodd: false }];
  }

  const subpaths = splitZmSubpaths(cleaned);
  if (shouldSplitZmSubpaths(subpaths)) {
    return subpaths.map((subpath) => ({ d: subpath, evenodd: false }));
  }

  return [{ d: joinCompoundPath(subpaths), evenodd: true }];
}

function expandPathStrings(paths) {
  return paths.flatMap((d) => {
    const cleaned = normalizeCompoundSeparators(d);
    if (cleaned.includes("ZM")) {
      return splitZmSubpaths(cleaned);
    }
    return [cleanPathD(d)];
  });
}

function shouldMergeHoleGroup(group) {
  if (group.length < 2) return false;

  const bboxes = group.map((entry) => approximateBBox(entry.d));
  const sorted = [...bboxes].sort((a, b) => bboxArea(b) - bboxArea(a));
  const largest = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const innerCenter = bboxCenter(sorted[i]);
    if (
      !isContained(sorted[i], largest) ||
      bboxArea(sorted[i]) >= bboxArea(largest) * 0.9 ||
      innerCenter.x < largest.minX ||
      innerCenter.x > largest.maxX ||
      innerCenter.y < largest.minY ||
      innerCenter.y > largest.maxY
    ) {
      return false;
    }
  }

  return true;
}

function mergeHoleGroups(paths) {
  const remaining = paths.map((entry) => ({
    d: cleanPathD(typeof entry === "string" ? entry : entry.d),
    evenodd: false,
  }));
  const merged = [];

  while (remaining.length > 0) {
    const seed = remaining.shift();
    const group = [seed];

    for (let i = remaining.length - 1; i >= 0; i--) {
      const candidate = remaining[i];
      const trial = [...group, candidate];
      if (shouldMergeHoleGroup(trial)) {
        group.push(candidate);
        remaining.splice(i, 1);
      }
    }

    if (group.length === 1) {
      merged.push(group[0]);
      continue;
    }

    const sorted = group.sort(
      (a, b) => bboxArea(approximateBBox(b.d)) - bboxArea(approximateBBox(a.d)),
    );
    const compound = joinCompoundPath(sorted.map((entry) => entry.d));
    merged.push({ d: compound, evenodd: true });
  }

  return merged;
}

export function processPaths(paths) {
  const expanded = expandPathStrings(paths).flatMap((d) => processSinglePath(d));
  return mergeHoleGroups(expanded);
}

function layoutFromPathBounds(paths, frameW = 24, frameH = 24) {
  const bboxes = paths.map(approximateBBox);
  const minX = Math.min(...bboxes.map((bbox) => bbox.minX));
  const minY = Math.min(...bboxes.map((bbox) => bbox.minY));
  const maxX = Math.max(...bboxes.map((bbox) => bbox.maxX));
  const maxY = Math.max(...bboxes.map((bbox) => bbox.maxY));
  const contentW = round(maxX - minX);
  const contentH = round(maxY - minY);

  return {
    x: round((frameW - contentW) / 2),
    y: round((frameH - contentH) / 2),
    w: contentW,
    h: contentH,
    viewBox: `${round(minX)} ${round(minY)} ${contentW} ${contentH}`,
    paths,
  };
}

function combinedBBox(paths) {
  const bboxes = paths.map(approximateBBox);
  if (!bboxes.length) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return {
    minX: Math.min(...bboxes.map((bbox) => bbox.minX)),
    minY: Math.min(...bboxes.map((bbox) => bbox.minY)),
    maxX: Math.max(...bboxes.map((bbox) => bbox.maxX)),
    maxY: Math.max(...bboxes.map((bbox) => bbox.maxY)),
  };
}

function pathsUseFrameCoordinates(paths, frameW, frameH, tolerance = 0.5) {
  const bbox = combinedBBox(paths);
  const width = bbox.maxX - bbox.minX;
  const height = bbox.maxY - bbox.minY;
  const centerX = (bbox.minX + bbox.maxX) / 2;
  const centerY = (bbox.minY + bbox.maxY) / 2;
  const isSmallGlyph =
    width < frameW - tolerance * 2 || height < frameH - tolerance * 2;
  const isCentered =
    Math.abs(centerX - frameW / 2) <= 2.5 &&
    Math.abs(centerY - frameH / 2) <= 2.5;

  if (isSmallGlyph && !isCentered) {
    return false;
  }

  return (
    bbox.minX >= -tolerance &&
    bbox.minY >= -tolerance &&
    bbox.maxX <= frameW + tolerance &&
    bbox.maxY <= frameH + tolerance
  );
}

function flatFrameLayout(paths, frameW, frameH) {
  return {
    x: 0,
    y: 0,
    w: frameW,
    h: frameH,
    viewBox: `0 0 ${frameW} ${frameH}`,
    paths,
  };
}

export function parseIconLayout(svg) {
  const nested = svg.match(
    /<svg[^>]*\sx="([\d.]+)"\sy="([\d.]+)"[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"[^>]*viewBox="([^"]+)"/,
  );

  const paths = extractPaths(svg);

  if (nested) {
    const viewBox = parseViewBoxString(nested[5]);
    const bounds = layoutFromPathBounds(paths);
    const usesTightBounds =
      bounds.h > 0 &&
      bounds.w > 0 &&
      (bounds.h < viewBox.h - 0.5 || bounds.w < viewBox.w - 0.5);

    if (usesTightBounds) {
      return bounds;
    }

    return {
      x: round(Number(nested[1])),
      y: round(Number(nested[2])),
      w: round(viewBox.w),
      h: round(viewBox.h),
      viewBox: nested[5].trim(),
      paths,
    };
  }

  const { w, h } = parseViewBox(svg);

  if (paths.length > 0 && pathsUseFrameCoordinates(paths, w, h)) {
    return flatFrameLayout(paths, w, h);
  }

  if (paths.length > 0) {
    const bounds = layoutFromPathBounds(paths, w, h);
    if (
      bounds.w > 0 &&
      bounds.h > 0 &&
      (bounds.w < w - 0.5 || bounds.h < h - 0.5)
    ) {
      return bounds;
    }
  }

  return {
    x: round((24 - w) / 2),
    y: round((24 - h) / 2),
    w,
    h,
    viewBox: `0 0 ${w} ${h}`,
    paths,
  };
}

function formatPath({ d, evenodd }) {
  if (evenodd) {
    return `    <path d="${d}" fill-rule="evenodd" fill="var(--fill-0, black)"/>`;
  }
  return `    <path d="${d}" fill="var(--fill-0, black)"/>`;
}

function renderFlatSvg(paths) {
  const pathMarkup = paths.map(formatPath).join("\n");
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${pathMarkup.replace(/^    /gm, "  ")}\n</svg>\n`;
}

function offsetPathD(d, dx, dy) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  const result = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i++];
    if (!/[a-zA-Z]/.test(token)) {
      continue;
    }

    const command = token.toUpperCase();
    result.push(token);

    if (command === "Z") {
      continue;
    }

    const count = COMMAND_LENGTHS[command];
    if (count === undefined) {
      continue;
    }

    if (command === "H") {
      for (let p = 0; p < count; p++) {
        result.push(round(parseFloat(tokens[i++]) + dx));
      }
      continue;
    }

    if (command === "V") {
      for (let p = 0; p < count; p++) {
        result.push(round(parseFloat(tokens[i++]) + dy));
      }
      continue;
    }

    for (let p = 0; p < count; p += 2) {
      result.push(round(parseFloat(tokens[i++]) + dx));
      result.push(round(parseFloat(tokens[i++]) + dy));
    }
  }

  return result.join(" ");
}

function bakeLayoutTranslation(layout, paths) {
  const viewBox = parseViewBoxString(
    layout.viewBox ?? `0 0 ${layout.w} ${layout.h}`,
  );
  const scaleX = layout.w / viewBox.w;
  const scaleY = layout.h / viewBox.h;

  if (Math.abs(scaleX - 1) > 0.001 || Math.abs(scaleY - 1) > 0.001) {
    return null;
  }

  const dx = layout.x - viewBox.x * scaleX;
  const dy = layout.y - viewBox.y * scaleY;

  return paths.map((entry) => ({
    ...entry,
    d: offsetPathD(entry.d, dx, dy),
  }));
}

/** Paths already positioned in the outer 24×24 frame (Figma crop viewBox). */
function pathsAreInAbsoluteFrameSpace(layout, pathStrings) {
  const viewBox = parseViewBoxString(
    layout.viewBox ?? `0 0 ${layout.w} ${layout.h}`,
  );
  if (viewBox.x > 0.5 || viewBox.y > 0.5) {
    return pathsUseFrameCoordinates(pathStrings, 24, 24);
  }
  return false;
}

export function renderIconSvg(layout) {
  const processedPaths = processPaths(layout.paths);
  const pathStrings = processedPaths.map((entry) => entry.d);

  if (pathsAreInAbsoluteFrameSpace(layout, pathStrings)) {
    return renderFlatSvg(processedPaths);
  }

  const bakedPaths = bakeLayoutTranslation(layout, processedPaths);
  if (
    bakedPaths &&
    pathsUseFrameCoordinates(
      bakedPaths.map((entry) => entry.d),
      24,
      24,
    )
  ) {
    return renderFlatSvg(bakedPaths);
  }

  if (layout.w === 24 && layout.h === 24 && layout.x === 0 && layout.y === 0) {
    return renderFlatSvg(processedPaths);
  }

  const viewBox = parseViewBoxString(
    layout.viewBox ?? `0 0 ${layout.w} ${layout.h}`,
  );
  const scaleX = layout.w / viewBox.w;
  const scaleY = layout.h / viewBox.h;
  const pathMarkup = processedPaths.map(formatPath).join("\n");

  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${layout.x}, ${layout.y}) scale(${round(scaleX)}, ${round(scaleY)}) translate(${round(-viewBox.x)}, ${round(-viewBox.y)})">
${pathMarkup}
  </g>
</svg>
`;
}

export function normalizeSvg(rawSvg) {
  const { w, h } = parseViewBox(rawSvg);
  const paths = extractPaths(rawSvg);

  if (paths.length > 0 && pathsUseFrameCoordinates(paths, w, h)) {
    return renderIconSvg(flatFrameLayout(paths, w, h));
  }

  const bounds = layoutFromPathBounds(paths, w, h);
  const layout =
    bounds.w > 0 &&
    bounds.h > 0 &&
    (bounds.w < w - 0.5 || bounds.h < h - 0.5)
      ? bounds
      : {
          x: round((24 - w) / 2),
          y: round((24 - h) / 2),
          w,
          h,
          viewBox: `0 0 ${w} ${h}`,
          paths,
        };
  return renderIconSvg(layout);
}

export function validateNormalizedSvg(name, svg) {
  const paths = extractPaths(svg);
  const bboxes = paths.map(approximateBBox);

  for (let i = 0; i < bboxes.length; i++) {
    for (let j = i + 1; j < bboxes.length; j++) {
      const inner = bboxArea(bboxes[i]) < bboxArea(bboxes[j]) ? bboxes[i] : bboxes[j];
      const outer = bboxArea(bboxes[i]) < bboxArea(bboxes[j]) ? bboxes[j] : bboxes[i];

      if (
        bboxArea(inner) > 0 &&
        bboxArea(outer) > bboxArea(inner) * 1.1 &&
        isContained(inner, outer) &&
        centersMatch(inner, outer) &&
        !svg.includes('fill-rule="evenodd"')
      ) {
        throw new Error(
          `${name}: nested concentric paths without fill-rule="evenodd"`,
        );
      }
    }
  }

  if (/\sZ\s+M\s+M/i.test(svg)) {
    throw new Error(`${name}: corrupted compound path join`);
  }

  if (/<svg[^>]*>\s*<svg/i.test(svg)) {
    throw new Error(`${name}: nested <svg> elements are not supported on native`);
  }

  if (/<g\s+transform=/i.test(svg)) {
    throw new Error(`${name}: <g transform> should be baked into flat paths for native`);
  }
}

export function buildRegistry(names, iconsDir, fs) {
  const entries = names.map((name) => {
    const svg = fs
      .readFileSync(`${iconsDir}/${name}.svg`, "utf8")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");
    return `  "${name}": \`${svg}\`,`;
  });

  return `// Auto-generated from Figma assets (node 45:42)
// Do not edit by hand — run: pnpm --filter @kaddie/ui sync-icons
export const iconNames = ${JSON.stringify(names, null, 2)} as const;

export type IconName = (typeof iconNames)[number];

export const iconSources: Record<IconName, string> = {
${entries.join("\n")}
};
`;
}
