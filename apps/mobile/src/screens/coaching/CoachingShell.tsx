import { useState } from "react";
import { CoachingBenchmarksScreen } from "./CoachingBenchmarksScreen";
import { CoachingGoalsScreen } from "./CoachingGoalsScreen";
import { CoachingHomeScreen } from "./CoachingHomeScreen";
import { CoachingInsightDetailScreen } from "./CoachingInsightDetailScreen";
import { coachingInsights } from "./coachingMockData";
import { CoachingPracticePlanScreen } from "./CoachingPracticePlanScreen";
import { CoachingRoundSummaryScreen } from "./CoachingRoundSummaryScreen";
import { CoachingStrategyScreen } from "./CoachingStrategyScreen";
import { CoachingWeeklyFocusScreen } from "./CoachingWeeklyFocusScreen";

export type CoachingSubRoute =
  | "home"
  | "insight-detail"
  | { type: "insight-detail"; insightId: string }
  | "weekly-focus"
  | "practice-plan"
  | "goals"
  | "round-summary"
  | "strategy"
  | "benchmarks";

type CoachingShellProps = {
  onBack: () => void;
};

export function CoachingShell({ onBack }: CoachingShellProps) {
  const [route, setRoute] = useState<CoachingSubRoute>("home");

  const goHome = () => setRoute("home");

  if (route === "home") {
    return <CoachingHomeScreen onBack={onBack} onNavigate={setRoute} />;
  }

  if (route === "weekly-focus") {
    return (
      <CoachingWeeklyFocusScreen
        onBack={goHome}
        onOpenPracticePlan={() => setRoute("practice-plan")}
      />
    );
  }

  if (route === "practice-plan") {
    return <CoachingPracticePlanScreen onBack={goHome} />;
  }

  if (route === "goals") {
    return <CoachingGoalsScreen onBack={goHome} />;
  }

  if (route === "round-summary") {
    return <CoachingRoundSummaryScreen onBack={goHome} />;
  }

  if (route === "strategy") {
    return <CoachingStrategyScreen onBack={goHome} />;
  }

  if (route === "benchmarks") {
    return <CoachingBenchmarksScreen onBack={goHome} />;
  }

  if (route === "insight-detail" || (typeof route === "object" && route.type === "insight-detail")) {
    const insightId =
      typeof route === "object" ? route.insightId : coachingInsights[0]?.id;
    const insight =
      coachingInsights.find((item) => item.id === insightId) ?? coachingInsights[0];
    return <CoachingInsightDetailScreen insight={insight} onBack={goHome} />;
  }

  return <CoachingHomeScreen onBack={onBack} onNavigate={setRoute} />;
}
