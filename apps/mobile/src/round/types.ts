import type { ImageSourcePropType } from "react-native";
import type { RoundConfig } from "../screens/roundConfig";

export type RoundTab = "map" | "scorecard" | "menu";

export type RoundSession = {
  config: RoundConfig;
  startedAt: number;
};

export type MapPoint = {
  x: number;
  y: number;
};

export type DistancePillVariant = "primary" | "secondary" | "hazard" | "dark";

export type MapDistanceMarker = {
  id: string;
  label: string;
  position: MapPoint;
  variant: DistancePillVariant;
  /** Pixel nudge applied after layout (negative y moves up). */
  offsetX?: number;
  offsetY?: number;
};

export type LieOption =
  | "fairway"
  | "light-rough"
  | "heavy-rough"
  | "divot"
  | "straw"
  | "sand";

export type SlopeOption =
  | "flat"
  | "above-feet"
  | "below-feet"
  | "up-slope"
  | "down-slope";

export type HoleDistances = {
  front: number;
  middle: number;
  back: number;
};

export type HoleData = {
  number: number;
  par: number;
  yardage: number;
  strokeIndex: number;
  windKph: number;
  mapImage: ImageSourcePropType;
  mapImageOffset: { x: number; y: number; scale: number };
  player: MapPoint;
  /** Pixel nudge for GPS marker and line origin (negative y moves up). */
  playerOffset?: { x?: number; y?: number };
  green: MapPoint;
  defaultTarget: MapPoint;
  markers: MapDistanceMarker[];
  distances: HoleDistances;
  clubRecommendation: string;
};

export type RoundMapState = {
  holes: HoleData[];
  currentHoleIndex: number;
  sheetExpanded: boolean;
  targetMode: boolean;
  target: MapPoint;
  lie: LieOption;
  slope: SlopeOption;
};
