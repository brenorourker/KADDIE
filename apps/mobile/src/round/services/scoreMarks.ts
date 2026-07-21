export type ScoreMark = "none" | "bogey" | "double" | "under";

/** Circle = bogey, dark fill = double bogey+, red fill = under par. */
export function getScoreMark(score: number, par: number): ScoreMark {
  const diff = score - par;
  if (diff <= -1) return "under";
  if (diff === 1) return "bogey";
  if (diff >= 2) return "double";
  return "none";
}

export function sumScores(
  scores: Readonly<Record<number, number | undefined>>,
  holeNumbers: readonly number[],
): number | null {
  let total = 0;
  let hasAny = false;
  for (const hole of holeNumbers) {
    const score = scores[hole];
    if (score == null) continue;
    hasAny = true;
    total += score;
  }
  return hasAny ? total : null;
}
