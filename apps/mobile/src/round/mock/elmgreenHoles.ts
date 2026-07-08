import { recommendClub } from "../services/clubRecommendation";
import { demoWindKphForHole } from "../services/windColor";
import type { HoleData, HoleDistances } from "../types";

const aerialHole12 = require("../../assets/in-round/aerial-hole-12.png");

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

function createDemoHole(spec: (typeof SCORECARD_HOLES)[number]): HoleData {
  const middle =
    spec.number === 12 ? 178 : remainingYards(spec.yardage, spec.par);
  const distances = greenDistances(middle);

  return {
    number: spec.number,
    par: spec.par,
    yardage: spec.yardage,
    strokeIndex: spec.strokeIndex,
    windKph: demoWindKphForHole(spec.number),
    mapImage: aerialHole12,
    mapImageOffset: mapOffsetForHole(spec.number),
    ...DEMO_MAP_LAYOUT,
    markers: demoMarkers(distances.middle),
    distances,
    clubRecommendation: recommendClub(
      distances.middle,
      "fairway",
      "flat",
      "SOFT 7 IRON",
    ),
  };
}

export const elmgreenHoles: HoleData[] = SCORECARD_HOLES.map(createDemoHole);

export const defaultHoleIndex = elmgreenHoles.findIndex((h) => h.number === 1);
