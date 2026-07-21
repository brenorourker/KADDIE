import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePersona } from "../personas/PersonaProvider";
import type { RoundConfig } from "../screens/roundConfig";
import { defaultHoleIndex, elmgreenHoles } from "./mock/elmgreenHoles";
import {
  buildClubDistanceOptions,
  recommendClub,
} from "./services/clubRecommendation";
import { computePlaysLikeYards } from "./services/playsLikeDistance";
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
  playsLikeYards: number;
  clubRecommendation: string;
  shotNumber: number;
  /** Saved strokes per hole number; unplayed holes are absent. */
  holeScores: Readonly<Record<number, number>>;
  goToPreviousHole: () => void;
  goToNextHole: () => void;
  goToHole: (holeNumber: number) => void;
  toggleSheetExpanded: () => void;
  setSheetExpanded: (expanded: boolean) => void;
  enterTargetMode: (point: MapPoint) => void;
  exitTargetMode: () => void;
  setTarget: (point: MapPoint) => void;
  setLie: (lie: LieOption) => void;
  setSlope: (slope: SlopeOption) => void;
  setShotNumber: (shotNumber: number) => void;
  updateConfig: (config: RoundConfig) => void;
};

const RoundMapContext = createContext<RoundMapContextValue | null>(null);

type RoundMapProviderProps = {
  config: RoundConfig;
  onConfigChange?: (config: RoundConfig) => void;
  children: ReactNode;
};

export function RoundMapProvider({
  config: configProp,
  onConfigChange,
  children,
}: RoundMapProviderProps) {
  const { bagData, clubDetails } = usePersona();
  const [config, setConfig] = useState(configProp);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(
    defaultHoleIndex >= 0 ? defaultHoleIndex : 0,
  );
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [targetMode, setTargetMode] = useState(false);
  const [lie, setLie] = useState<LieOption>("fairway");
  const [slope, setSlope] = useState<SlopeOption>("flat");
  const [shotNumber, setShotNumber] = useState(1);
  const [holeScores, setHoleScores] = useState<Record<number, number>>({});

  const currentHole = elmgreenHoles[currentHoleIndex] ?? elmgreenHoles[0];
  const [target, setTargetState] = useState<MapPoint>(currentHole.defaultTarget);
  const previousHoleIndexRef = useRef(currentHoleIndex);
  const holeScoresRef = useRef(holeScores);
  holeScoresRef.current = holeScores;
  const shotNumberRef = useRef(shotNumber);
  shotNumberRef.current = shotNumber;
  const shotDirtyRef = useRef(false);

  useEffect(() => {
    setConfig(configProp);
  }, [configProp]);

  const updateConfig = useCallback(
    (next: RoundConfig) => {
      setConfig(next);
      onConfigChange?.(next);
    },
    [onConfigChange],
  );

  const commitAndGoToIndex = useCallback((nextIndex: number) => {
    if (nextIndex === currentHoleIndex) return;

    const leaving = elmgreenHoles[currentHoleIndex] ?? elmgreenHoles[0];
    const arriving = elmgreenHoles[nextIndex] ?? elmgreenHoles[0];
    const nextScores = { ...holeScoresRef.current };
    const alreadyScored = nextScores[leaving.number] != null;
    if (shotDirtyRef.current || alreadyScored) {
      nextScores[leaving.number] = shotNumberRef.current;
    }
    holeScoresRef.current = nextScores;
    shotDirtyRef.current = false;
    setHoleScores(nextScores);
    setShotNumber(nextScores[arriving.number] ?? 1);
    setCurrentHoleIndex(nextIndex);
  }, [currentHoleIndex]);

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
    commitAndGoToIndex(
      currentHoleIndex === 0 ? elmgreenHoles.length - 1 : currentHoleIndex - 1,
    );
  }, [commitAndGoToIndex, currentHoleIndex]);

  const goToNextHole = useCallback(() => {
    commitAndGoToIndex(
      currentHoleIndex === elmgreenHoles.length - 1 ? 0 : currentHoleIndex + 1,
    );
  }, [commitAndGoToIndex, currentHoleIndex]);

  const goToHole = useCallback(
    (holeNumber: number) => {
      const nextIndex = elmgreenHoles.findIndex((hole) => hole.number === holeNumber);
      if (nextIndex < 0) return;
      commitAndGoToIndex(nextIndex);
    },
    [commitAndGoToIndex],
  );

  const updateShotNumber = useCallback(
    (next: number) => {
      const clamped = Math.min(99, Math.max(1, Math.round(next)));
      const holeNumber =
        (elmgreenHoles[currentHoleIndex] ?? elmgreenHoles[0]).number;
      shotDirtyRef.current = true;
      shotNumberRef.current = clamped;
      setShotNumber(clamped);
      setHoleScores((prev) => {
        const nextScores = { ...prev, [holeNumber]: clamped };
        holeScoresRef.current = nextScores;
        return nextScores;
      });
    },
    [currentHoleIndex],
  );

  const displayDistances = currentHole.distances;

  const playsLikeYards = useMemo(
    () =>
      computePlaysLikeYards({
        middleYards: displayDistances.middle,
        lie,
        slope,
        windKph: currentHole.windKph,
        temperatureC: currentHole.temperatureC,
      }),
    [
      currentHole.temperatureC,
      currentHole.windKph,
      displayDistances.middle,
      lie,
      slope,
    ],
  );

  const bagClubOptions = useMemo(() => {
    const clubs = bagData.sections.flatMap((section) => section.clubs);
    return buildClubDistanceOptions(clubs, clubDetails);
  }, [bagData.sections, clubDetails]);

  const clubRecommendation = useMemo(
    () =>
      recommendClub(
        playsLikeYards,
        currentHole.clubRecommendation,
        bagClubOptions,
      ),
    [bagClubOptions, currentHole.clubRecommendation, playsLikeYards],
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
      playsLikeYards,
      clubRecommendation,
      shotNumber,
      holeScores,
      goToPreviousHole,
      goToNextHole,
      goToHole,
      toggleSheetExpanded: () => setSheetExpanded((expanded) => !expanded),
      setSheetExpanded,
      enterTargetMode: (point) => {
        setTargetState(point);
        setTargetMode(true);
      },
      exitTargetMode: () => setTargetMode(false),
      setTarget: setTargetState,
      setLie,
      setSlope,
      setShotNumber: updateShotNumber,
      updateConfig,
    }),
    [
      clubRecommendation,
      config,
      currentHole,
      currentHoleIndex,
      displayDistances,
      goToHole,
      goToNextHole,
      goToPreviousHole,
      holeScores,
      lie,
      playsLikeYards,
      sheetExpanded,
      shotNumber,
      slope,
      target,
      targetMode,
      updateConfig,
      updateShotNumber,
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
