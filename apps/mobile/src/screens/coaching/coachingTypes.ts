export type CoachingCategory =
  | "driving"
  | "approach"
  | "short-game"
  | "putting"
  | "course-management";

export type CoachingPriority = "high" | "medium" | "low";

export type CoachingInsight = {
  id: string;
  priority: CoachingPriority;
  category: CoachingCategory;
  headline: string;
  impactStrokes: number;
  confidenceRounds: number;
  confidenceShots: number;
  evidence: string[];
  insight: string;
  recommendation: string;
  drillTitle: string;
  drillDescription: string;
};

export type CoachingDrill = {
  id: string;
  title: string;
  category: CoachingCategory;
  durationMinutes: number;
  reps: string;
  description: string;
  steps: string[];
};

export type CoachingGoal = {
  id: string;
  title: string;
  category: CoachingCategory;
  currentValue: string;
  targetValue: string;
  progress: number;
  trend: "improving" | "stable" | "declining";
};

export type CoachingStrategyCard = {
  id: string;
  hole: string;
  title: string;
  situation: string;
  recommendation: string;
  stat: string;
};

export type CoachingWeeklyFocus = {
  title: string;
  subtitle: string;
  category: CoachingCategory;
  strokesToGain: number;
  sessionsPerWeek: number;
  drillIds: string[];
};

export type CoachingRoundSummary = {
  course: string;
  date: string;
  score: number;
  vsPar: number;
  narrative: string;
  highlights: string[];
  focusAreas: string[];
};

export type CoachingBenchmark = {
  label: string;
  userValue: string;
  baselineValue: string;
  peerValue: string;
  trend: "better" | "worse" | "neutral";
};
