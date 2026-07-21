import type { HoleDistances, MapPoint } from "../types";
import type { MapSize } from "./mapProjection";

type ScreenPoint = { x: number; y: number };

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

function screenMidpoint(a: ScreenPoint, b: ScreenPoint): ScreenPoint {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pointOnScreenSegment(a: ScreenPoint, b: ScreenPoint, t: number): ScreenPoint {
  return {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
  };
}

function isInLabelSafeArea(
  point: ScreenPoint,
  mapSize: MapSize,
  topPadding: number,
  bottomPadding: number,
  horizontalPadding = 48,
) {
  return (
    point.x >= horizontalPadding &&
    point.x <= mapSize.width - horizontalPadding &&
    point.y >= topPadding &&
    point.y <= mapSize.height - bottomPadding
  );
}

/** Pick a label position on a screen segment, preferring the midpoint but staying visible. */
export function visibleLabelPointOnSegment(
  start: ScreenPoint,
  end: ScreenPoint,
  mapSize: MapSize,
  topPadding: number,
  bottomPadding: number,
  preferredT = 0.5,
): ScreenPoint {
  const candidates = [
    preferredT,
    0.5,
    0.45,
    0.55,
    0.4,
    0.6,
    0.35,
    0.65,
    0.3,
    0.7,
    0.25,
    0.75,
    0.2,
    0.8,
  ];

  const seen = new Set<number>();
  for (const t of candidates) {
    const rounded = Math.round(t * 100);
    if (seen.has(rounded)) continue;
    seen.add(rounded);

    const point = pointOnScreenSegment(start, end, t);
    if (isInLabelSafeArea(point, mapSize, topPadding, bottomPadding)) {
      return point;
    }
  }

  return screenMidpoint(start, end);
}

export type TargetModeScreenPill = {
  id: string;
  label: string;
  position: ScreenPoint;
  variant: "dark";
};

/** Screen-space target mode pills aligned to the drawn line segments. */
export function getTargetModeScreenPills(
  playerAnchor: ScreenPoint,
  targetAnchor: ScreenPoint,
  greenAnchor: ScreenPoint,
  player: MapPoint,
  target: MapPoint,
  green: MapPoint,
  mapSize: MapSize,
  topPadding: number,
  bottomPadding: number,
): TargetModeScreenPill[] {
  const toTarget = yardsBetween(player, target, 89, 0.21);
  const targetToGreen = yardsBetween(target, green, 89, 0.21);

  return [
    {
      id: "target-seg-1",
      label: `${toTarget || 89} yds`,
      position: visibleLabelPointOnSegment(
        playerAnchor,
        targetAnchor,
        mapSize,
        topPadding,
        bottomPadding,
      ),
      variant: "dark",
    },
    {
      id: "target-seg-2",
      label: `${targetToGreen || 89} yds`,
      position: visibleLabelPointOnSegment(
        targetAnchor,
        greenAnchor,
        mapSize,
        topPadding,
        bottomPadding,
      ),
      variant: "dark",
    },
  ];
}
