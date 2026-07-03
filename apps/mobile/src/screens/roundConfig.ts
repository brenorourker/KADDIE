export type RoundConfig = {
  name: string;
  course: string;
  format: string;
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

export const defaultRoundConfig: RoundConfig = {
  name: "Brendan O'Rourke",
  course: "elmgreen",
  format: "stroke-gross",
  golfers: "Brendan O'Rourke",
};

export function getCourseLabel(value: string) {
  return courseOptions.find((option) => option.value === value)?.label ?? value;
}

export function getFormatLabel(value: string) {
  return formatOptions.find((option) => option.value === value)?.label ?? value;
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
