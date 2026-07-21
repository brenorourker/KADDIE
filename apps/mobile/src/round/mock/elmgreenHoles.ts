import { recommendClub } from "../services/clubRecommendation";
import { yardsBetween } from "../services/distances";
import { imagePointToViewportMapPoint } from "../services/mapProjection";
import { computePlaysLikeYards } from "../services/playsLikeDistance";
import { demoWindBearingDegForHole, demoWindKphForHole } from "../services/windColor";
import type { HoleData, HoleDistances, MapImagePoint, MapPoint } from "../types";

/** Demo temps (°C) — one value cycling with hole number. */
const DEMO_TEMPERATURES_C = [18, 22, 15, 24, 12, 20] as const;

function demoTemperatureCForHole(holeNumber: number): number {
  return DEMO_TEMPERATURES_C[(holeNumber - 1) % DEMO_TEMPERATURES_C.length];
}

function defaultClubRecommendation(
  middleYards: number,
  windKph: number,
  temperatureC: number,
) {
  const playsLike = computePlaysLikeYards({
    middleYards,
    lie: "fairway",
    slope: "flat",
    windKph,
    temperatureC,
  });
  return recommendClub(playsLike, "SOFT 7 IRON");
}

const courseMap = require("../../assets/in-round/course-map.png");
const aerialHole12 = require("../../assets/in-round/aerial-hole-12.png");

/** Native dimensions of `course-map.png`. */
export const COURSE_MAP_SIZE = { width: 4096, height: 2625 };
const COURSE_MAP_ASPECT = COURSE_MAP_SIZE.height / COURSE_MAP_SIZE.width;

/** Reference viewport for deriving normalized overlay coordinates from image pixels. */
const REFERENCE_MAP_SIZE = { width: 390, height: 654 };

/** Figma hole frame used for map crop framing (500×1000). */
const FIGMA_FRAME_WIDTH = 500;

/** Figma map frame width (1252:2831) */
const DESIGN_MAP_WIDTH = 390;
/** Aerial image frame (1252:2832): left -359, top 33; header height 110 */
const HOLE_12_MAP_OFFSET = {
  x: -359 / DESIGN_MAP_WIDTH,
  y: (33 - 110) / DESIGN_MAP_WIDTH,
  scale: 1088 / DESIGN_MAP_WIDTH,
};

/** Shared map overlay layout tuned on hole 12 (UI demo — not georeferenced). */
const DEMO_MAP_LAYOUT = {
  player: { x: 0.467, y: 0.68 },
  green: { x: 0.662, y: 0.335 },
  defaultTarget: { x: 0.346, y: 0.22 },
};

type RealHoleMapConfig = {
  mapImageOffset: { x: number; y: number; scale: number };
  mapRotationDeg: number;
  teeImagePoint: MapImagePoint;
  greenImagePoint: MapImagePoint;
};

type RealHoleMapFeature = {
  id: string;
  kind: "bunker" | "hazard" | "information";
  imagePoint: MapImagePoint;
};

function mapFeatureVariant(
  kind: RealHoleMapFeature["kind"],
): HoleData["markers"][number]["variant"] {
  switch (kind) {
    case "bunker":
      return "secondary";
    case "hazard":
      return "hazard";
    case "information":
      return "information";
  }
}

/** Bunkers and hazards on the shared course map (image pixel coordinates). */
const REAL_HOLE_MAP_FEATURES: Record<number, RealHoleMapFeature[]> = {
  1: [
    { id: "hole-1-bunker-1", kind: "bunker", imagePoint: { x: 1818, y: 1359 } },
    { id: "hole-1-bunker-2", kind: "bunker", imagePoint: { x: 1850, y: 1490 } },
    {
      id: "hole-1-information-1",
      kind: "information",
      imagePoint: { x: 1927, y: 1323 },
    },
    {
      id: "hole-1-information-2",
      kind: "information",
      imagePoint: { x: 1846, y: 1632 },
    },
  ],
  2: [
    { id: "hole-2-bunker-1", kind: "bunker", imagePoint: { x: 2280, y: 2324 } },
    { id: "hole-2-bunker-2", kind: "bunker", imagePoint: { x: 2892, y: 2383 } },
    { id: "hole-2-bunker-3", kind: "bunker", imagePoint: { x: 2904, y: 2448 } },
    { id: "hole-2-bunker-4", kind: "bunker", imagePoint: { x: 2958, y: 2471 } },
    { id: "hole-2-bunker-5", kind: "bunker", imagePoint: { x: 2983, y: 2334 } },
    {
      id: "hole-2-information-1",
      kind: "information",
      imagePoint: { x: 2206, y: 2143 },
    },
    {
      id: "hole-2-information-2",
      kind: "information",
      imagePoint: { x: 2191, y: 2334 },
    },
    {
      id: "hole-2-information-3",
      kind: "information",
      imagePoint: { x: 2647, y: 2281 },
    },
    {
      id: "hole-2-information-4",
      kind: "information",
      imagePoint: { x: 2594, y: 2394 },
    },
  ],
  3: [
    { id: "hole-3-bunker-1", kind: "bunker", imagePoint: { x: 3152, y: 1814 } },
    { id: "hole-3-bunker-2", kind: "bunker", imagePoint: { x: 3208, y: 1824 } },
    { id: "hole-3-bunker-3", kind: "bunker", imagePoint: { x: 3261, y: 1797 } },
    {
      id: "hole-3-information-1",
      kind: "information",
      imagePoint: { x: 3084, y: 1981 },
    },
  ],
  4: [
    { id: "hole-4-bunker-1", kind: "bunker", imagePoint: { x: 2209, y: 1454 } },
    { id: "hole-4-bunker-2", kind: "bunker", imagePoint: { x: 2208, y: 1345 } },
    {
      id: "hole-4-information-1",
      kind: "information",
      imagePoint: { x: 2308, y: 1406 },
    },
  ],
  5: [
    { id: "hole-5-hazard-1", kind: "hazard", imagePoint: { x: 2274, y: 1665 } },
    { id: "hole-5-bunker-1", kind: "bunker", imagePoint: { x: 2118, y: 1599 } },
    { id: "hole-5-bunker-2", kind: "bunker", imagePoint: { x: 2075, y: 1695 } },
  ],
  6: [
    { id: "hole-6-bunker-1", kind: "bunker", imagePoint: { x: 2059, y: 908 } },
    { id: "hole-6-bunker-2", kind: "bunker", imagePoint: { x: 2106, y: 893 } },
    { id: "hole-6-bunker-3", kind: "bunker", imagePoint: { x: 2150, y: 920 } },
    {
      id: "hole-6-information-1",
      kind: "information",
      imagePoint: { x: 2006, y: 996 },
    },
    {
      id: "hole-6-information-2",
      kind: "information",
      imagePoint: { x: 2006, y: 1107 },
    },
  ],
  7: [
    { id: "hole-7-bunker-1", kind: "bunker", imagePoint: { x: 1121, y: 1349 } },
    { id: "hole-7-bunker-2", kind: "bunker", imagePoint: { x: 1180, y: 1389 } },
    {
      id: "hole-7-information-1",
      kind: "information",
      imagePoint: { x: 1194, y: 1254 },
    },
    {
      id: "hole-7-information-2",
      kind: "information",
      imagePoint: { x: 1109, y: 1252 },
    },
  ],
  8: [
    { id: "hole-8-bunker-1", kind: "bunker", imagePoint: { x: 201, y: 1183 } },
    {
      id: "hole-8-information-1",
      kind: "information",
      imagePoint: { x: 336, y: 1203 },
    },
    {
      id: "hole-8-information-2",
      kind: "information",
      imagePoint: { x: 598, y: 1357 },
    },
    {
      id: "hole-8-information-3",
      kind: "information",
      imagePoint: { x: 675, y: 1264 },
    },
  ],
  9: [
    { id: "hole-9-bunker-1", kind: "bunker", imagePoint: { x: 1223, y: 762 } },
    { id: "hole-9-bunker-2", kind: "bunker", imagePoint: { x: 1245, y: 815 } },
    {
      id: "hole-9-information-1",
      kind: "information",
      imagePoint: { x: 634, y: 1181 },
    },
    {
      id: "hole-9-information-2",
      kind: "information",
      imagePoint: { x: 715, y: 1082 },
    },
    {
      id: "hole-9-information-3",
      kind: "information",
      imagePoint: { x: 859, y: 1164 },
    },
  ],
  10: [
    { id: "hole-10-bunker-1", kind: "bunker", imagePoint: { x: 1410, y: 1525 } },
    { id: "hole-10-bunker-2", kind: "bunker", imagePoint: { x: 1499, y: 1604 } },
    { id: "hole-10-hazard-1", kind: "hazard", imagePoint: { x: 1464, y: 1365 } },
  ],
  11: [
    { id: "hole-11-bunker-1", kind: "bunker", imagePoint: { x: 1514, y: 1770 } },
    { id: "hole-11-bunker-2", kind: "bunker", imagePoint: { x: 1563, y: 1821 } },
    { id: "hole-11-bunker-3", kind: "bunker", imagePoint: { x: 1532, y: 1905 } },
  ],
  12: [
    { id: "hole-12-bunker-1", kind: "bunker", imagePoint: { x: 1758, y: 837 } },
    { id: "hole-12-bunker-2", kind: "bunker", imagePoint: { x: 1838, y: 867 } },
    {
      id: "hole-12-information-1",
      kind: "information",
      imagePoint: { x: 1708, y: 1335 },
    },
  ],
  13: [
    { id: "hole-13-bunker-1", kind: "bunker", imagePoint: { x: 3255, y: 929 } },
    { id: "hole-13-bunker-2", kind: "bunker", imagePoint: { x: 2189, y: 1001 } },
    { id: "hole-13-bunker-3", kind: "bunker", imagePoint: { x: 3291, y: 1030 } },
    {
      id: "hole-13-information-1",
      kind: "information",
      imagePoint: { x: 2488, y: 796 },
    },
    {
      id: "hole-13-information-2",
      kind: "information",
      imagePoint: { x: 2698, y: 818 },
    },
  ],
  14: [
    { id: "hole-14-bunker-1", kind: "bunker", imagePoint: { x: 2371, y: 975 } },
    { id: "hole-14-bunker-2", kind: "bunker", imagePoint: { x: 2358, y: 1030 } },
  ],
  15: [
    { id: "hole-15-bunker-1", kind: "bunker", imagePoint: { x: 2927, y: 1243 } },
    {
      id: "hole-15-information-1",
      kind: "information",
      imagePoint: { x: 2890, y: 1349 },
    },
    { id: "hole-15-bunker-2", kind: "bunker", imagePoint: { x: 3135, y: 1263 } },
    { id: "hole-15-bunker-3", kind: "bunker", imagePoint: { x: 3101, y: 1321 } },
    { id: "hole-15-bunker-4", kind: "bunker", imagePoint: { x: 3117, y: 1395 } },
  ],
  16: [
    { id: "hole-16-bunker-1", kind: "bunker", imagePoint: { x: 3735, y: 375 } },
    { id: "hole-16-bunker-2", kind: "bunker", imagePoint: { x: 3620, y: 382 } },
    {
      id: "hole-16-information-1",
      kind: "information",
      imagePoint: { x: 2567, y: 651 },
    },
    {
      id: "hole-16-information-2",
      kind: "information",
      imagePoint: { x: 3567, y: 651 },
    },
  ],
  17: [
    { id: "hole-17-bunker-1", kind: "bunker", imagePoint: { x: 3303, y: 569 } },
    { id: "hole-17-bunker-2", kind: "bunker", imagePoint: { x: 3404, y: 587 } },
    { id: "hole-17-bunker-3", kind: "bunker", imagePoint: { x: 3291, y: 634 } },
  ],
  18: [
    { id: "hole-18-bunker-1", kind: "bunker", imagePoint: { x: 2312, y: 573 } },
    { id: "hole-18-bunker-2", kind: "bunker", imagePoint: { x: 2281, y: 672 } },
    { id: "hole-18-bunker-3", kind: "bunker", imagePoint: { x: 2231, y: 658 } },
    {
      id: "hole-18-information-1",
      kind: "information",
      imagePoint: { x: 2672, y: 656 },
    },
    {
      id: "hole-18-information-2",
      kind: "information",
      imagePoint: { x: 2709, y: 802 },
    },
    {
      id: "hole-18-information-3",
      kind: "information",
      imagePoint: { x: 2531, y: 757 },
    },
  ],
};

/** Map framing from Figma; tee/green from source-map pixel coordinates. */
const REAL_HOLE_MAP_CONFIG: Record<number, RealHoleMapConfig> = {
  1: {
    mapImageOffset: figmaMapOffset(-1686.14, -892.44, 3384.691),
    mapRotationDeg: 169,
    teeImagePoint: { x: 1973, y: 781 },
    greenImagePoint: { x: 1716, y: 1873 },
  },
  2: {
    mapImageOffset: figmaMapOffset(-1263, -814, 2399.302),
    mapRotationDeg: -103.67,
    teeImagePoint: { x: 1677, y: 2087 },
    greenImagePoint: { x: 2966, y: 2407 },
  },
  3: {
    mapImageOffset: figmaMapOffset(-3034, -877.38, 4391.899),
    mapRotationDeg: -8.2,
    teeImagePoint: { x: 3103, y: 2582 },
    greenImagePoint: { x: 3215, y: 1751 },
  },
  4: {
    teeImagePoint: { x: 3246, y: 1617 },
    greenImagePoint: { x: 2169, y: 1395 },
    ...deriveMapFramingFromTeeGreen(
      { x: 3246, y: 1617 },
      { x: 2169, y: 1395 },
    ),
  },
  5: {
    teeImagePoint: { x: 2469, y: 1699 },
    greenImagePoint: { x: 2046, y: 1634 },
    ...deriveMapFramingFromTeeGreen(
      { x: 2469, y: 1699 },
      { x: 2046, y: 1634 },
      { framingZoom: 1.495 },
    ),
  },
  6: {
    teeImagePoint: { x: 1929, y: 1602 },
    greenImagePoint: { x: 2113, y: 820 },
    ...deriveMapFramingFromTeeGreen(
      { x: 1929, y: 1602 },
      { x: 2113, y: 820 },
    ),
  },
  7: {
    teeImagePoint: { x: 1379, y: 865 },
    greenImagePoint: { x: 1120, y: 1407 },
    ...deriveMapFramingFromTeeGreen(
      { x: 1379, y: 865 },
      { x: 1120, y: 1407 },
      { framingZoom: 1.495 },
    ),
  },
  8: {
    teeImagePoint: { x: 1121, y: 1610 },
    greenImagePoint: { x: 164, y: 1228 },
    ...deriveMapFramingFromTeeGreen(
      { x: 1121, y: 1610 },
      { x: 164, y: 1228 },
    ),
  },
  9: {
    teeImagePoint: { x: 212, y: 1064 },
    greenImagePoint: { x: 1279, y: 763 },
    ...deriveMapFramingFromTeeGreen(
      { x: 212, y: 1064 },
      { x: 1279, y: 763 },
    ),
  },
  10: {
    teeImagePoint: { x: 1551, y: 639 },
    greenImagePoint: { x: 1463, y: 1564 },
    ...deriveMapFramingFromTeeGreen(
      { x: 1551, y: 639 },
      { x: 1463, y: 1564 },
    ),
  },
  11: {
    teeImagePoint: { x: 1216, y: 1664 },
    greenImagePoint: { x: 1518, y: 1844 },
    ...deriveMapFramingFromTeeGreen(
      { x: 1216, y: 1664 },
      { x: 1518, y: 1844 },
      { framingZoom: 1.495 },
    ),
  },
  12: {
    teeImagePoint: { x: 1594, y: 1721 },
    greenImagePoint: { x: 1836, y: 794 },
    ...deriveMapFramingFromTeeGreen(
      { x: 1594, y: 1721 },
      { x: 1836, y: 794 },
    ),
  },
  13: {
    teeImagePoint: { x: 2175, y: 725 },
    greenImagePoint: { x: 3269, y: 989 },
    ...deriveMapFramingFromTeeGreen(
      { x: 2175, y: 725 },
      { x: 3269, y: 989 },
    ),
  },
  14: {
    teeImagePoint: { x: 3216, y: 1190 },
    greenImagePoint: { x: 2305, y: 991 },
    ...deriveMapFramingFromTeeGreen(
      { x: 3216, y: 1190 },
      { x: 2305, y: 991 },
    ),
  },
  15: {
    teeImagePoint: { x: 2242, y: 1198 },
    greenImagePoint: { x: 3182, y: 1327 },
    ...deriveMapFramingFromTeeGreen(
      { x: 2242, y: 1198 },
      { x: 3182, y: 1327 },
    ),
  },
  16: {
    teeImagePoint: { x: 3341, y: 1701 },
    greenImagePoint: { x: 3689, y: 340 },
    ...deriveMapFramingFromTeeGreen(
      { x: 3341, y: 1701 },
      { x: 3689, y: 340 },
    ),
  },
  17: {
    teeImagePoint: { x: 3493, y: 179 },
    greenImagePoint: { x: 3347, y: 632 },
    ...deriveMapFramingFromTeeGreen(
      { x: 3493, y: 179 },
      { x: 3347, y: 632 },
      { framingZoom: 1.495 },
    ),
  },
  18: {
    teeImagePoint: { x: 3318, y: 781 },
    greenImagePoint: { x: 2232, y: 601 },
    ...deriveMapFramingFromTeeGreen(
      { x: 3318, y: 781 },
      { x: 2232, y: 601 },
    ),
  },
};

/** Black tees — Par — Stroke index from course scorecard (golfdublin.com). */
const SCORECARD_HOLES = [
  { number: 1, yardage: 367, par: 4, strokeIndex: 3 },
  { number: 2, yardage: 434, par: 5, strokeIndex: 11 },
  { number: 3, yardage: 276, par: 4, strokeIndex: 15 },
  { number: 4, yardage: 361, par: 4, strokeIndex: 5 },
  { number: 5, yardage: 173, par: 3, strokeIndex: 13 },
  { number: 6, yardage: 260, par: 4, strokeIndex: 17 },
  { number: 7, yardage: 194, par: 3, strokeIndex: 9 },
  { number: 8, yardage: 341, par: 4, strokeIndex: 7 },
  { number: 9, yardage: 397, par: 4, strokeIndex: 1 },
  { number: 10, yardage: 301, par: 4, strokeIndex: 10 },
  { number: 11, yardage: 135, par: 3, strokeIndex: 18 },
  { number: 12, yardage: 317, par: 4, strokeIndex: 12 },
  { number: 13, yardage: 365, par: 4, strokeIndex: 2 },
  { number: 14, yardage: 301, par: 4, strokeIndex: 8 },
  { number: 15, yardage: 306, par: 4, strokeIndex: 14 },
  { number: 16, yardage: 467, par: 5, strokeIndex: 4 },
  { number: 17, yardage: 158, par: 3, strokeIndex: 16 },
  { number: 18, yardage: 363, par: 4, strokeIndex: 6 },
] as const;

function figmaMapOffset(left: number, top: number, width: number) {
  return {
    x: left / FIGMA_FRAME_WIDTH,
    y: top / FIGMA_FRAME_WIDTH,
    scale: width / FIGMA_FRAME_WIDTH,
  };
}

/** Estimate Figma map framing from tee/green when per-hole Figma values aren't available yet. */
function deriveMapFramingFromTeeGreen(
  tee: MapImagePoint,
  green: MapImagePoint,
  options?: { framingZoom?: number },
): Pick<RealHoleMapConfig, "mapImageOffset" | "mapRotationDeg"> {
  const dx = green.x - tee.x;
  const dy = green.y - tee.y;
  const holeLength = Math.hypot(dx, dy) || 1;
  const midX = (tee.x + green.x) / 2;
  const midY = (tee.y + green.y) / 2;

  let rotationDeg = (Math.atan2(dx, dy) * 180) / Math.PI;
  rotationDeg += dy > 0 ? 180 : -180;
  if (rotationDeg > 180) rotationDeg -= 360;
  if (rotationDeg < -180) rotationDeg += 360;

  const framingZoom = options?.framingZoom ?? 1;
  const width = Math.max(holeLength * 3.8, 2400) * framingZoom;
  const left = 250 - (midX * width) / COURSE_MAP_SIZE.width;
  const topAnchor = dy > 0 ? 200 : 1443;
  const top = topAnchor - (midY * width) / COURSE_MAP_SIZE.width;

  return {
    mapImageOffset: figmaMapOffset(left, top, width),
    mapRotationDeg: rotationDeg,
  };
}

function viewportPointsFromImage(
  mapConfig: RealHoleMapConfig,
): { player: MapPoint; green: MapPoint; defaultTarget: MapPoint } {
  const toViewport = (point: MapImagePoint) =>
    imagePointToViewportMapPoint(
      point,
      COURSE_MAP_SIZE,
      mapConfig.mapImageOffset,
      COURSE_MAP_ASPECT,
      REFERENCE_MAP_SIZE,
      mapConfig.mapRotationDeg,
    );

  const player = toViewport(mapConfig.teeImagePoint);
  const green = toViewport(mapConfig.greenImagePoint);
  const defaultTarget = toViewport({
    x:
      mapConfig.teeImagePoint.x +
      (mapConfig.greenImagePoint.x - mapConfig.teeImagePoint.x) * 0.42,
    y:
      mapConfig.teeImagePoint.y +
      (mapConfig.greenImagePoint.y - mapConfig.teeImagePoint.y) * 0.42,
  });

  return { player, green, defaultTarget };
}

function greenDistances(middle: number): HoleDistances {
  return {
    front: Math.max(middle - 15, 1),
    middle,
    back: middle + 17,
  };
}

function remainingYards(yardage: number, par: number) {
  if (par === 3) return Math.round(yardage * 0.9);
  if (par === 5) return Math.round(yardage * 0.52);
  return Math.round(yardage * 0.56);
}


/** Pan/zoom the shared aerial so each hole feels distinct in demos. */
function mapOffsetForHole(holeNumber: number) {
  const index = holeNumber - 1;
  const column = index % 6;
  const row = Math.floor(index / 6);

  return {
    x: HOLE_12_MAP_OFFSET.x - column * 0.07,
    y: HOLE_12_MAP_OFFSET.y - row * 0.05,
    scale: HOLE_12_MAP_OFFSET.scale + (index % 4) * 0.04,
  };
}

function demoMarkers(middleYards: number): HoleData["markers"] {
  return [
    {
      id: "m1",
      label: "190 yds",
      position: { x: 0.462, y: 0.16 },
      variant: "secondary",
      offsetX: 5,
      offsetY: -75,
    },
    {
      id: "m3",
      label: "151 yds",
      position: { x: 0.272, y: 0.343 },
      variant: "hazard",
      offsetX: 25,
      offsetY: -52,
    },
    {
      id: "hole-target",
      label: `${middleYards} yds`,
      position: DEMO_MAP_LAYOUT.green,
      variant: "primary",
      offsetX: -84,
      offsetY: -153,
    },
  ];
}

function createRealHole(
  spec: (typeof SCORECARD_HOLES)[number],
  mapConfig: RealHoleMapConfig,
): HoleData {
  const distances = greenDistances(spec.yardage);
  const { player, green, defaultTarget } = viewportPointsFromImage(mapConfig);
  const toViewport = (point: MapImagePoint) =>
    imagePointToViewportMapPoint(
      point,
      COURSE_MAP_SIZE,
      mapConfig.mapImageOffset,
      COURSE_MAP_ASPECT,
      REFERENCE_MAP_SIZE,
      mapConfig.mapRotationDeg,
    );

  const featureMarkers: HoleData["markers"] = (
    REAL_HOLE_MAP_FEATURES[spec.number] ?? []
  ).map((feature) => {
    const position = toViewport(feature.imagePoint);
    const yards = yardsBetween(player, position);

    return {
      id: feature.id,
      label: `${yards} yds`,
      position,
      imagePoint: feature.imagePoint,
      variant: mapFeatureVariant(feature.kind),
    };
  });

  const windKph = demoWindKphForHole(spec.number);
  const windBearingDeg = demoWindBearingDegForHole(spec.number);
  const temperatureC = demoTemperatureCForHole(spec.number);

  return {
    number: spec.number,
    par: spec.par,
    yardage: spec.yardage,
    strokeIndex: spec.strokeIndex,
    windKph,
    windBearingDeg,
    temperatureC,
    mapImage: courseMap,
    mapImageSize: COURSE_MAP_SIZE,
    mapImageOffset: mapConfig.mapImageOffset,
    mapRotationDeg: mapConfig.mapRotationDeg,
    teeImagePoint: mapConfig.teeImagePoint,
    greenImagePoint: mapConfig.greenImagePoint,
    player,
    green,
    defaultTarget,
    markers: [
      ...featureMarkers,
      {
        id: "hole-target",
        label: `${spec.yardage} yds`,
        position: green,
        imagePoint: mapConfig.greenImagePoint,
        variant: "primary",
      },
    ],
    distances,
    clubRecommendation: defaultClubRecommendation(
      distances.middle,
      windKph,
      temperatureC,
    ),
  };
}

function createDemoHole(spec: (typeof SCORECARD_HOLES)[number]): HoleData {
  const middle =
    spec.number === 12 ? 178 : remainingYards(spec.yardage, spec.par);
  const distances = greenDistances(middle);

  const windKph = demoWindKphForHole(spec.number);
  const windBearingDeg = demoWindBearingDegForHole(spec.number);
  const temperatureC = demoTemperatureCForHole(spec.number);

  return {
    number: spec.number,
    par: spec.par,
    yardage: spec.yardage,
    strokeIndex: spec.strokeIndex,
    windKph,
    windBearingDeg,
    temperatureC,
    mapImage: aerialHole12,
    mapImageOffset: mapOffsetForHole(spec.number),
    ...DEMO_MAP_LAYOUT,
    markers: demoMarkers(distances.middle),
    distances,
    clubRecommendation: defaultClubRecommendation(
      distances.middle,
      windKph,
      temperatureC,
    ),
  };
}

function createHole(spec: (typeof SCORECARD_HOLES)[number]): HoleData {
  const realConfig = REAL_HOLE_MAP_CONFIG[spec.number];
  if (realConfig) {
    return createRealHole(spec, realConfig);
  }

  return createDemoHole(spec);
}

export const elmgreenHoles: HoleData[] = SCORECARD_HOLES.map(createHole);

export const defaultHoleIndex = elmgreenHoles.findIndex((h) => h.number === 1);
