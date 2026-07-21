import type { LieOption, SlopeOption } from "../types";

/** Yard bump per lie tier (harder lie → plays longer). */
const lieAdjustments: Record<LieOption, number> = {
  fairway: 0,
  "light-rough": 1,
  "heavy-rough": 2,
  divot: 1,
  straw: 1,
  sand: 3,
};

/** Yard bump per slope tier. */
const slopeAdjustments: Record<SlopeOption, number> = {
  flat: 0,
  "above-feet": 0,
  "below-feet": 1,
  "up-slope": 1,
  "down-slope": -1,
};

/** Neutral reference: no temperature adjustment at 20°C. */
const REFERENCE_TEMP_C = 20;

/** Calm baseline — wind above this plays longer (into-wind bias for demo). */
const REFERENCE_WIND_KPH = 10;

export type PlaysLikeInput = {
  middleYards: number;
  lie: LieOption;
  slope: SlopeOption;
  windKph: number;
  temperatureC: number;
};

/**
 * Distance middle “plays like” after wind, slope, lie, and temperature.
 * Demo formula — replace with real conditions model later.
 */
export function computePlaysLikeYards({
  middleYards,
  lie,
  slope,
  windKph,
  temperatureC,
}: PlaysLikeInput): number {
  const lieYards = lieAdjustments[lie] * 5;
  const slopeYards = slopeAdjustments[slope] * 3;
  const windYards = Math.round((windKph - REFERENCE_WIND_KPH) * 0.35);
  const tempYards = Math.round(REFERENCE_TEMP_C - temperatureC);

  return Math.max(
    1,
    Math.round(middleYards + lieYards + slopeYards + windYards + tempYards),
  );
}
