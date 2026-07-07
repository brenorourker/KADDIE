import type { LieOption, SlopeOption } from "../types";

const lieAdjustments: Record<LieOption, number> = {
  fairway: 0,
  "light-rough": 1,
  "heavy-rough": 2,
  divot: 1,
  straw: 1,
  sand: 3,
};

const slopeAdjustments: Record<SlopeOption, number> = {
  flat: 0,
  "above-feet": 0,
  "below-feet": 1,
  "up-slope": 1,
  "down-slope": -1,
};

const clubsByDistance: ReadonlyArray<{ max: number; label: string }> = [
  { max: 90, label: "SOFT SW" },
  { max: 110, label: "SOFT PW" },
  { max: 130, label: "SOFT 9 IRON" },
  { max: 150, label: "SOFT 8 IRON" },
  { max: 170, label: "SOFT 7 IRON" },
  { max: 190, label: "SOFT 6 IRON" },
  { max: 210, label: "SOFT 5 IRON" },
  { max: 999, label: "SOFT 4 IRON" },
];

export function recommendClub(
  middleYards: number,
  lie: LieOption,
  slope: SlopeOption,
  fallback: string,
) {
  const adjusted =
    middleYards + lieAdjustments[lie] * 5 + slopeAdjustments[slope] * 3;
  const match = clubsByDistance.find((club) => adjusted <= club.max);
  return match?.label ?? fallback;
}
