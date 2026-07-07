import type {
  CoachingBenchmark,
  CoachingDrill,
  CoachingGoal,
  CoachingInsight,
  CoachingRoundSummary,
  CoachingStrategyCard,
  CoachingWeeklyFocus,
} from "./coachingTypes";

export const coachingInsights: CoachingInsight[] = [
  {
    id: "driving-accuracy",
    priority: "high",
    category: "driving",
    headline: "You're losing ~1.4 strokes/round off the tee",
    impactStrokes: 1.4,
    confidenceRounds: 12,
    confidenceShots: 84,
    evidence: [
      "Fairways hit: 38% (your 10-round avg: 52%)",
      "Penalties off the tee: 1.8/round vs 0.6 in better rounds",
      "Misses are 70% right on holes under 400 yds",
    ],
    insight:
      "Driver on shorter holes is pulling you right into trouble. Your 3-wood finds the fairway far more often.",
    recommendation:
      "Use 3-wood on 6 holes where you've missed right 4+ times — projected save: ~0.8 strokes/round.",
    drillTitle: "Alignment gate drill",
    drillDescription: "20 balls, 2×/week — focus on start-line control through an alignment gate.",
  },
  {
    id: "approach-short-left",
    priority: "high",
    category: "approach",
    headline: "Approaches from 150–180 yds cost you 2.1 strokes",
    impactStrokes: 2.1,
    confidenceRounds: 10,
    confidenceShots: 62,
    evidence: [
      "GIR from 150–180: 22% (rest of bag: 41%)",
      "Miss pattern: short-left on 48% of misses",
      "Worst on elevated greens (+0.6 strokes/hole)",
    ],
    insight:
      "Likely under-clubbing or pulling on elevated targets. One more club would land you pin-high more often.",
    recommendation:
      "Add one club from 150–180 when the pin is back or the green is elevated.",
    drillTitle: "150-yd distance ladder",
    drillDescription: "10 balls each to 145/155/165 yds with carry feedback.",
  },
  {
    id: "lag-putting",
    priority: "medium",
    category: "putting",
    headline: "Lag putting added 1.1 strokes/round recently",
    impactStrokes: 1.1,
    confidenceRounds: 5,
    confidenceShots: 90,
    evidence: [
      "3-putt rate: 22% of greens (prior 20 rounds: 12%)",
      "Avg first putt when 3-putting: 38 ft",
      "Leaves 6+ ft 64% of the time on fast greens",
    ],
    insight:
      "Speed control inside 40 ft is the leak — you're dying putts short or racing them past.",
    recommendation:
      "Aim for a 2-ft circle past the hole, not the cup. Prioritize speed over line from 30+ ft.",
    drillTitle: "30–40 ft lag ladder",
    drillDescription: "20 putts from 30, 35, and 40 ft — score by leave distance.",
  },
  {
    id: "par-5-scoring",
    priority: "medium",
    category: "course-management",
    headline: "Par 5s are where rounds unravel",
    impactStrokes: 0.9,
    confidenceRounds: 8,
    confidenceShots: 40,
    evidence: [
      "Par 5 scoring: 6.3 avg (handicap expectation: 5.4)",
      "68% of doubles follow a second-shot miss",
      "Going for green in 2 from 230+ → bogey+ 71% of time",
    ],
    insight:
      "Aggressive second shots on long par 5s aren't paying off. Your wedge game from 100–120 yds is a strength.",
    recommendation:
      "Lay up to 100–120 yds on par 5s over 520 yds — wedge GIR from there is 58%.",
    drillTitle: "Lay-up landing zone",
    drillDescription: "Practice 3-wood/hybrid lay-ups to a 30-yd wide target at 220–240 yds.",
  },
  {
    id: "bunker-saves",
    priority: "low",
    category: "short-game",
    headline: "Greenside bunkers cost ~0.9 strokes/round",
    impactStrokes: 0.9,
    confidenceRounds: 6,
    confidenceShots: 24,
    evidence: [
      "Sand save: 19% (handicap peers: ~35%)",
      "80% of failures leave the ball >15 ft from the hole",
      "Direction is fine — distance control is the issue",
    ],
    insight:
      "You're getting out consistently but rarely close enough for a confident putt.",
    recommendation:
      "Practice 15–25 yd explosion shots with consistent exit speed to a 10-ft circle.",
    drillTitle: "Bunker distance control",
    drillDescription: "10 balls from the same lie — all must finish inside 10 ft.",
  },
];

export const coachingWeeklyFocus: CoachingWeeklyFocus = {
  title: "Approach play from 125–175 yds",
  subtitle: "Your biggest opportunity this week based on the last 10 rounds.",
  category: "approach",
  strokesToGain: 1.8,
  sessionsPerWeek: 3,
  drillIds: ["approach-ladder", "wedge-matrix", "elevated-greens"],
};

export const coachingDrills: CoachingDrill[] = [
  {
    id: "approach-ladder",
    title: "150-yd distance ladder",
    category: "approach",
    durationMinutes: 25,
    reps: "30 shots",
    description: "Build reliable carry distances with your mid irons.",
    steps: [
      "Warm up with 5 half-swings to your 7-iron.",
      "Hit 10 balls to 145 yds — note carry on each.",
      "Hit 10 balls to 155 yds — adjust one club if needed.",
      "Hit 10 balls to 165 yds — finish with 5 full swings.",
      "Log your best 5 carries for each distance.",
    ],
  },
  {
    id: "wedge-matrix",
    title: "Wedge distance matrix",
    category: "approach",
    durationMinutes: 20,
    reps: "30 shots",
    description: "Separate your 52°, 56°, and 60° distances with ¾ swings.",
    steps: [
      "Hit 10 shots with 52° using a ¾ swing.",
      "Hit 10 shots with 56° using a ¾ swing.",
      "Hit 10 shots with 60° using a ¾ swing.",
      "Record average carry for each club.",
      "Aim for at least 8 yds between each wedge.",
    ],
  },
  {
    id: "elevated-greens",
    title: "Elevated green club-up",
    category: "approach",
    durationMinutes: 15,
    reps: "20 shots",
    description: "Practice taking one extra club when the green sits above you.",
    steps: [
      "Pick an elevated target or use a raised mat.",
      "Hit 10 shots with your normal club selection.",
      "Hit 10 shots adding one club — compare proximity.",
      "Note how many land pin-high with each approach.",
    ],
  },
  {
    id: "alignment-gate",
    title: "Alignment gate drill",
    category: "driving",
    durationMinutes: 20,
    reps: "40 balls",
    description: "Train a consistent start line with driver and 3-wood.",
    steps: [
      "Set two alignment sticks 18 inches apart, 15 ft ahead.",
      "Hit 20 drivers through the gate at 60% speed.",
      "Hit 20 3-woods through the gate at full speed.",
      "Score yourself: 1 point per ball through the gate.",
      "Target: 28+ points out of 40.",
    ],
  },
  {
    id: "lag-ladder",
    title: "30–40 ft lag ladder",
    category: "putting",
    durationMinutes: 15,
    reps: "20 putts",
    description: "Improve speed control on long putts to cut 3-putts.",
    steps: [
      "Place balls at 30, 35, and 40 ft from the hole.",
      "Putt 6 balls from each distance (18 total).",
      "Score: 3 pts inside 2 ft, 2 pts inside 4 ft, 1 pt inside 6 ft.",
      "Finish with 2 putts focusing only on speed.",
      "Target score: 30+ points.",
    ],
  },
];

export const coachingGoals: CoachingGoal[] = [
  {
    id: "three-putts",
    title: "Reduce 3-putts",
    category: "putting",
    currentValue: "4.2 / round",
    targetValue: "3.0 / round",
    progress: 0.35,
    trend: "improving",
  },
  {
    id: "gir-150-180",
    title: "GIR from 150–180 yds",
    category: "approach",
    currentValue: "22%",
    targetValue: "35%",
    progress: 0.18,
    trend: "stable",
  },
  {
    id: "fairways",
    title: "Fairways hit",
    category: "driving",
    currentValue: "38%",
    targetValue: "50%",
    progress: 0.42,
    trend: "declining",
  },
  {
    id: "scrambling",
    title: "Scrambling",
    category: "short-game",
    currentValue: "31%",
    targetValue: "40%",
    progress: 0.55,
    trend: "improving",
  },
];

export const coachingRoundSummary: CoachingRoundSummary = {
  course: "Elmgreen Golf Club",
  date: "Sat 28 Jun",
  score: 87,
  vsPar: 15,
  narrative:
    "Solid front nine, but the back nine told the story. Three doubles on holes 11, 14, and 16 all started with approach misses left — the same pattern we've flagged in your coaching feed. Putting held up well: only one 3-putt despite fast greens.",
  highlights: [
    "Birdie on 3 — best approach of the day from 162 yds",
    "Scrambled for par on 7 after missing fairway right",
    "Only 28 putts — 2 below your recent average",
  ],
  focusAreas: [
    "Approach misses left from 150–180 yds (holes 11, 14, 16)",
    "Driver on hole 10 — missed right into rough",
    "Par 5 on 18 — lay-up decision saved a potential double",
  ],
};

export const coachingStrategyCards: CoachingStrategyCard[] = [
  {
    id: "hole-4",
    hole: "Hole 4 · Par 4 · 385 yds",
    title: "Club down off the tee",
    situation: "Narrow fairway with water right. You've penalized here 3 of last 5 rounds.",
    recommendation: "Use hybrid instead of driver. Fairway % jumps from 40% to 78% on this hole.",
    stat: "Projected save: 0.6 strokes",
  },
  {
    id: "hole-10",
    hole: "Hole 10 · Par 4 · 410 yds",
    title: "Favour the left side",
    situation: "Your misses trend right on the back nine opening hole.",
    recommendation: "Aim at the left edge of the fairway bunker. Even a miss left is recoverable.",
    stat: "Right miss rate: 70%",
  },
  {
    id: "hole-14",
    hole: "Hole 14 · Par 5 · 535 yds",
    title: "Lay up to your wedge yardage",
    situation: "Going for green in 2 from 240+ hasn't worked here.",
    recommendation: "Lay up to 110 yds. Your GIR from 100–120 is 58% vs 22% from 200+.",
    stat: "Bogey+ when going for it: 71%",
  },
  {
    id: "hole-16",
    hole: "Hole 16 · Par 3 · 172 yds",
    title: "Take one more club",
    situation: "Elevated green with a back pin. You've been short-left 4 of 6 visits.",
    recommendation: "Club up one and aim centre-green. Avoid the front-left bunker.",
    stat: "Short-left miss: 67%",
  },
];

export const coachingBenchmarks: CoachingBenchmark[] = [
  {
    label: "Scoring average",
    userValue: "87.4",
    baselineValue: "89.1",
    peerValue: "86.2",
    trend: "better",
  },
  {
    label: "GIR %",
    userValue: "34%",
    baselineValue: "31%",
    peerValue: "38%",
    trend: "better",
  },
  {
    label: "Fairways hit",
    userValue: "38%",
    baselineValue: "45%",
    peerValue: "42%",
    trend: "worse",
  },
  {
    label: "Putts per round",
    userValue: "32.1",
    baselineValue: "33.4",
    peerValue: "31.8",
    trend: "better",
  },
  {
    label: "Penalties / round",
    userValue: "2.4",
    baselineValue: "1.6",
    peerValue: "1.8",
    trend: "worse",
  },
];

export const categoryLabels: Record<string, string> = {
  driving: "Driving",
  approach: "Approach",
  "short-game": "Short game",
  putting: "Putting",
  "course-management": "Course mgmt",
};
