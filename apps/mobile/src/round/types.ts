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

/** Pixel coordinate on the source map image (top-left origin). */
export type MapImagePoint = {
  x: number;
  y: number;
};

export type MapImageSize = {
  width: number;
  height: number;
};

export type DistancePillVariant =
  | "primary"
  | "secondary"
  | "hazard"
  | "dark"
  | "information";

export type MapDistanceMarker = {
  id: string;
  label: string;
  position: MapPoint;
  variant: DistancePillVariant;
  /** Source-map pixel position; used for accurate placement on rotated course maps. */
  imagePoint?: MapImagePoint;
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
  /** Compass bearing the wind blows toward (0 = N, 90 = E). */
  windBearingDeg: number;
  /** Ambient temperature (°C) used for plays-like distance. */
  temperatureC: number;
  mapImage: ImageSourcePropType;
  mapImageOffset: { x: number; y: number; scale: number };
  /** Native pixel dimensions of `mapImage`. Required when using image points. */
  mapImageSize?: MapImageSize;
  /** Black-tee position on the unrotated source map (pixels). */
  teeImagePoint?: MapImagePoint;
  /** Green centre on the unrotated source map (pixels). */
  greenImagePoint?: MapImagePoint;
  /** Clockwise rotation of the course map image (degrees). */
  mapRotationDeg?: number;
  /** When false, GPS uses projected map coordinates instead of sheet snap. */
  mapGpsSnapToSheet?: boolean;
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
