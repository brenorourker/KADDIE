export type RoundConfig = {
  name: string;
  course: string;
  format: string;
  tees: string;
  golfers: string;
};

export const courseOptions = [
  { label: "Elmgreen Golf Club", value: "elmgreen" },
  { label: "Portmarnock Golf Club", value: "portmarnock" },
  { label: "Lahinch Golf Club", value: "lahinch" },
] as const;

export const formatOptions = [
  { label: "Stroke play (Gross)", value: "stroke-gross" },
  { label: "Stroke play (Net)", value: "stroke-net" },
  { label: "Stableford", value: "stableford" },
] as const;

export const teeOptions = [
  { label: "Blue (5727 yds - Hcp:11)", value: "blue" },
  { label: "Yellow (5516 yds - Hcp: 10)", value: "yellow" },
  { label: "Red (5092 yds - Hcp: 7)", value: "red" },
] as const;

export const defaultRoundConfig: RoundConfig = {
  name: "Brendan O'Rourke",
  course: "elmgreen",
  format: "stroke-gross",
  tees: "blue",
  golfers: "Brendan O'Rourke",
};

export function getCourseLabel(value: string) {
  return courseOptions.find((option) => option.value === value)?.label ?? value;
}

export function getFormatLabel(value: string) {
  return formatOptions.find((option) => option.value === value)?.label ?? value;
}

export function getTeeLabel(value: string) {
  return teeOptions.find((option) => option.value === value)?.label ?? value;
}

export function formatPlayersSummary(golfers: string) {
  const count = golfers
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean).length;

  return count === 1 ? "1 Player" : `${count} Players`;
}

export function formatRoundFormatLabel(formatValue: string) {
  const label = getFormatLabel(formatValue);
  return label.replace(/\s*\([^)]*\)\s*/, "").trim();
}
