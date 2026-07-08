import type { HoleDistances, MapPoint } from "../types";

function distanceBetween(a: MapPoint, b: MapPoint) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Mock yardage from normalized map distance (calibrated to hole 12 middle = 178 yds). */
export function yardsBetween(
  from: MapPoint,
  to: MapPoint,
  referenceYards = 178,
  referenceNormalized = 0.42,
) {
  const normalized = distanceBetween(from, to);
  if (normalized < 0.001) return 0;
  return Math.round((normalized / referenceNormalized) * referenceYards);
}

export function clampMapPoint(point: MapPoint): MapPoint {
  return {
    x: Math.min(1, Math.max(0, point.x)),
    y: Math.min(1, Math.max(0, point.y)),
  };
}

export function getTargetModeDistances(
  player: MapPoint,
  target: MapPoint,
  green: MapPoint,
  fallback: HoleDistances,
): HoleDistances & { toTarget: number; targetToGreen: number } {
  const toTarget = yardsBetween(player, target, 89, 0.21);
  const targetToGreen = yardsBetween(target, green, 89, 0.21);
  const middle = yardsBetween(player, green);

  return {
    front: fallback.front,
    middle: middle || fallback.middle,
    back: fallback.back,
    toTarget: toTarget || 89,
    targetToGreen: targetToGreen || 89,
  };
}

export function getTargetModeMarkers(
  player: MapPoint,
  target: MapPoint,
  green: MapPoint,
  holeMiddleYards: number,
) {
  const toTarget = yardsBetween(player, target, 89, 0.21);
  const targetToGreen = yardsBetween(target, green, 89, 0.21);

  return [
    {
      id: "target-seg-1",
      label: `${toTarget || 89} yds`,
      position: {
        x: (player.x + target.x) / 2,
        y: (player.y + target.y) / 2,
      },
      variant: "dark" as const,
    },
    {
      id: "target-seg-2",
      label: `${targetToGreen || 89} yds`,
      position: {
        x: (target.x + green.x) / 2,
        y: (target.y + green.y) / 2,
      },
      variant: "dark" as const,
    },
    {
      id: "hole-target",
      label: `${holeMiddleYards} yds`,
      position: green,
      variant: "primary" as const,
    },
  ];
}
