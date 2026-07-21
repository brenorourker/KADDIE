import type { ClubDetails } from "../../personas/types";
import { getClubDetails } from "../../personas/utils";

/**
 * Club recommendation from a plays-like distance.
 * Prefers the player's bag distances / shot types when available.
 */

export type ClubDistanceOption = {
  /** Display label, e.g. "PW" or "Half-swing PW". */
  label: string;
  distance: number;
};

/** Legacy distance table used when bag data is unavailable. */
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

export function buildClubDistanceOptions(
  clubs: ReadonlyArray<{ id: string; title: string }>,
  clubDetails: Record<string, ClubDetails>,
): ClubDistanceOption[] {
  const options: ClubDistanceOption[] = [];

  for (const club of clubs) {
    // Skip putter — not a full-swing recommendation target.
    if (club.id === "putter") {
      continue;
    }

    const details = getClubDetails(clubDetails, club.id);
    if (details.distance <= 0) {
      continue;
    }

    options.push({
      label: club.title,
      distance: details.distance,
    });

    for (const shot of details.shotTypes ?? []) {
      if (shot.distance <= 0 || !shot.label.trim()) {
        continue;
      }
      options.push({
        label: `${shot.label.trim()} ${club.title}`,
        distance: shot.distance,
      });
    }
  }

  return options;
}

function recommendFromOptions(
  playsLikeYards: number,
  options: ReadonlyArray<ClubDistanceOption>,
): string | null {
  if (options.length === 0) {
    return null;
  }

  let best = options[0];
  let bestDelta = Math.abs(options[0].distance - playsLikeYards);

  for (let i = 1; i < options.length; i++) {
    const option = options[i];
    const delta = Math.abs(option.distance - playsLikeYards);
    if (delta < bestDelta) {
      best = option;
      bestDelta = delta;
    }
  }

  return best.label;
}

export function recommendClub(
  playsLikeYards: number,
  fallback: string,
  bagOptions?: ReadonlyArray<ClubDistanceOption>,
) {
  const fromBag = bagOptions
    ? recommendFromOptions(playsLikeYards, bagOptions)
    : null;
  if (fromBag) {
    return fromBag;
  }

  const match = clubsByDistance.find((club) => playsLikeYards <= club.max);
  return match?.label ?? fallback;
}
