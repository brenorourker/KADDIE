import { golfCourseImage } from "../../personas/data/shared";
import type { HoleData } from "../types";

const sharedMapImage = golfCourseImage;
const aerialHole12 = require("../../assets/in-round/aerial-hole-12.png");

/** Figma map frame width (1252:2831) */
const DESIGN_MAP_WIDTH = 390;
/** Aerial image frame (1252:2832): left -359, top 33; header height 110 */
const HOLE_12_MAP_OFFSET = {
  x: -359 / DESIGN_MAP_WIDTH,
  y: (33 - 110) / DESIGN_MAP_WIDTH,
  scale: 1088 / DESIGN_MAP_WIDTH,
};

/** Normalized map coordinates (0–1) derived from Figma frames 1252:2831 / 1346:2482 */
export const elmgreenHoles: HoleData[] = [
  {
    number: 11,
    par: 4,
    yardage: 398,
    strokeIndex: 9,
    windKph: 18,
    mapImage: sharedMapImage,
    mapImageOffset: { x: -0.35, y: -0.05, scale: 1.4 },
    player: { x: 0.42, y: 0.78 },
    green: { x: 0.52, y: 0.22 },
    defaultTarget: { x: 0.48, y: 0.35 },
    markers: [
      { id: "m1", label: "165 yds", position: { x: 0.38, y: 0.55 }, variant: "secondary" },
      { id: "m2", label: "142 yds", position: { x: 0.45, y: 0.42 }, variant: "primary" },
    ],
    distances: { front: 128, middle: 142, back: 158 },
    clubRecommendation: "SOFT 6 IRON",
  },
  {
    number: 12,
    par: 4,
    yardage: 432,
    strokeIndex: 5,
    windKph: 21,
    mapImage: aerialHole12,
    mapImageOffset: HOLE_12_MAP_OFFSET,
    player: { x: 0.467, y: 0.68 },
    green: { x: 0.662, y: 0.335 },
    defaultTarget: { x: 0.346, y: 0.22 },
    markers: [
      { id: "m1", label: "190 yds", position: { x: 0.462, y: 0.16 }, variant: "secondary" },
      { id: "m2", label: "178 yds", position: { x: 0.39, y: 0.2 }, variant: "primary" },
      { id: "m3", label: "151 yds", position: { x: 0.272, y: 0.343 }, variant: "hazard" },
      { id: "m4", label: "78 yds", position: { x: 0.751, y: 0.428 }, variant: "secondary" },
    ],
    distances: { front: 163, middle: 178, back: 195 },
    clubRecommendation: "SOFT 7 IRON",
  },
  {
    number: 13,
    par: 3,
    yardage: 156,
    strokeIndex: 15,
    windKph: 24,
    mapImage: sharedMapImage,
    mapImageOffset: { x: -0.2, y: 0.1, scale: 1.6 },
    player: { x: 0.5, y: 0.82 },
    green: { x: 0.55, y: 0.28 },
    defaultTarget: { x: 0.54, y: 0.45 },
    markers: [
      { id: "m1", label: "156 yds", position: { x: 0.52, y: 0.38 }, variant: "primary" },
    ],
    distances: { front: 148, middle: 156, back: 168 },
    clubRecommendation: "SOFT 5 IRON",
  },
];

export const defaultHoleIndex = elmgreenHoles.findIndex((h) => h.number === 12);
