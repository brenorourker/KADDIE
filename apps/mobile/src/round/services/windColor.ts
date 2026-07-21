/** Weather-map wind icon colors (Option A). Icon only — speed text stays white. */
export const windIconColors = {
  /** 0–10 kph — calm / light */
  calm: "#60A5FA",
  /** 11–20 kph — gentle */
  gentle: "#34D399",
  /** 21–30 kph — moderate */
  moderate: "#FBBF24",
  /** 31–45 kph — strong */
  strong: "#F97316",
  /** 46–60 kph — very strong */
  veryStrong: "#EF4444",
  /** 61+ kph — severe / gale */
  severe: "#A855F7",
} as const;

export function getWindIconColor(speedKph: number): string {
  if (speedKph <= 10) return windIconColors.calm;
  if (speedKph <= 20) return windIconColors.gentle;
  if (speedKph <= 30) return windIconColors.moderate;
  if (speedKph <= 45) return windIconColors.strong;
  if (speedKph <= 60) return windIconColors.veryStrong;
  return windIconColors.severe;
}

/** Demo speeds — one representative value per tier for hole cycling. */
export const DEMO_WIND_SPEEDS = [8, 17, 25, 38, 52, 65] as const;

export function demoWindKphForHole(holeNumber: number): number {
  return DEMO_WIND_SPEEDS[(holeNumber - 1) % DEMO_WIND_SPEEDS.length];
}

/** 8-point compass — degrees clockwise from north (wind blows toward). */
export const DEMO_WIND_BEARINGS = [
  { label: "N", deg: 0 },
  { label: "NE", deg: 45 },
  { label: "E", deg: 90 },
  { label: "SE", deg: 135 },
  { label: "S", deg: 180 },
  { label: "SW", deg: 225 },
  { label: "W", deg: 270 },
  { label: "NW", deg: 315 },
] as const;

export function demoWindBearingDegForHole(holeNumber: number): number {
  return DEMO_WIND_BEARINGS[(holeNumber - 1) % DEMO_WIND_BEARINGS.length].deg;
}

export function demoWindBearingLabelForHole(holeNumber: number): string {
  return DEMO_WIND_BEARINGS[(holeNumber - 1) % DEMO_WIND_BEARINGS.length].label;
}
