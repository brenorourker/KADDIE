import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { RoundConfig } from "../screens/roundConfig";
import { defaultHoleIndex, elmgreenHoles } from "./mock/elmgreenHoles";
import { recommendClub } from "./services/clubRecommendation";
import { getTargetModeDistances } from "./services/distances";
import type {
  HoleData,
  LieOption,
  MapPoint,
  RoundSession,
  SlopeOption,
} from "./types";

type RoundMapContextValue = {
  session: RoundSession;
  config: RoundConfig;
  holes: HoleData[];
  currentHole: HoleData;
  currentHoleIndex: number;
  sheetExpanded: boolean;
  targetMode: boolean;
  target: MapPoint;
  lie: LieOption;
  slope: SlopeOption;
  displayDistances: { front: number; middle: number; back: number };
  clubRecommendation: string;
  goToPreviousHole: () => void;
  goToNextHole: () => void;
  toggleSheetExpanded: () => void;
  setSheetExpanded: (expanded: boolean) => void;
  enterTargetMode: () => void;
  exitTargetMode: () => void;
  setTarget: (point: MapPoint) => void;
  setLie: (lie: LieOption) => void;
  setSlope: (slope: SlopeOption) => void;
};

const RoundMapContext = createContext<RoundMapContextValue | null>(null);

type RoundMapProviderProps = {
  config: RoundConfig;
  children: ReactNode;
};

export function RoundMapProvider({ config, children }: RoundMapProviderProps) {
  const [currentHoleIndex, setCurrentHoleIndex] = useState(
    defaultHoleIndex >= 0 ? defaultHoleIndex : 0,
  );
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [targetMode, setTargetMode] = useState(false);
  const [lie, setLie] = useState<LieOption>("fairway");
  const [slope, setSlope] = useState<SlopeOption>("flat");

  const currentHole = elmgreenHoles[currentHoleIndex] ?? elmgreenHoles[0];
  const [target, setTargetState] = useState<MapPoint>(currentHole.defaultTarget);
  const previousHoleIndexRef = useRef(currentHoleIndex);

  useEffect(() => {
    if (previousHoleIndexRef.current === currentHoleIndex) return;

    previousHoleIndexRef.current = currentHoleIndex;
    const hole = elmgreenHoles[currentHoleIndex] ?? elmgreenHoles[0];
    setTargetState(hole.defaultTarget);
    setTargetMode(false);
    setSheetExpanded(false);
    setLie("fairway");
    setSlope("flat");
  }, [currentHoleIndex]);

  const goToPreviousHole = useCallback(() => {
    setCurrentHoleIndex((index) => {
      const next = Math.max(0, index - 1);
      return next;
    });
  }, []);

  const goToNextHole = useCallback(() => {
    setCurrentHoleIndex((index) => {
      const next = Math.min(elmgreenHoles.length - 1, index + 1);
      return next;
    });
  }, []);

  const displayDistances = useMemo(() => {
    if (targetMode) {
      const computed = getTargetModeDistances(
        currentHole.player,
        target,
        currentHole.green,
        currentHole.distances,
      );
      return {
        front: computed.front,
        middle: computed.middle,
        back: computed.back,
      };
    }
    return currentHole.distances;
  }, [currentHole, target, targetMode]);

  const clubRecommendation = useMemo(
    () =>
      recommendClub(
        displayDistances.middle,
        lie,
        slope,
        currentHole.clubRecommendation,
      ),
    [currentHole.clubRecommendation, displayDistances.middle, lie, slope],
  );

  const value = useMemo<RoundMapContextValue>(
    () => ({
      config,
      session: { config, startedAt: Date.now() },
      holes: elmgreenHoles,
      currentHole,
      currentHoleIndex,
      sheetExpanded,
      targetMode,
      target,
      lie,
      slope,
      displayDistances,
      clubRecommendation,
      goToPreviousHole,
      goToNextHole,
      toggleSheetExpanded: () => setSheetExpanded((expanded) => !expanded),
      setSheetExpanded,
      enterTargetMode: () => {
        setTargetState(currentHole.defaultTarget);
        setTargetMode(true);
      },
      exitTargetMode: () => setTargetMode(false),
      setTarget: setTargetState,
      setLie,
      setSlope,
    }),
    [
      clubRecommendation,
      config,
      currentHole,
      currentHoleIndex,
      displayDistances,
      goToNextHole,
      goToPreviousHole,
      lie,
      sheetExpanded,
      slope,
      target,
      targetMode,
    ],
  );

  return (
    <RoundMapContext.Provider value={value}>{children}</RoundMapContext.Provider>
  );
}

export function useRoundMap() {
  const context = useContext(RoundMapContext);

  if (!context) {
    throw new Error("useRoundMap must be used within RoundMapProvider");
  }

  return context;
}
