export type PreferenceSectionId =
  | "appearance"
  | "language"
  | "personality"
  | "parameters"
  | "subscription"
  | "notifications"
  | "privacy"
  | "help"
  | "contact"
  | "about";

export const preferenceSectionTitles: Record<PreferenceSectionId, string> = {
  appearance: "App appearance",
  language: "Language",
  personality: "Personality",
  parameters: "Parameters",
  subscription: "Subscription",
  notifications: "Notifications",
  privacy: "Privacy & security",
  help: "Help center",
  contact: "Contact support",
  about: "About",
};

export const languageOptions = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "ga", label: "Gaeilge" },
] as const;

export const personalityOptions = [
  {
    id: "encouraging",
    label: "Encouraging",
    supportingText: "Warm, positive, keeps you calm",
  },
  {
    id: "direct",
    label: "Direct",
    supportingText: "Short, clear calls with no fluff",
  },
  {
    id: "analytical",
    label: "Analytical",
    supportingText: "More numbers, wind, and shot shapes",
  },
  {
    id: "coach",
    label: "Coach",
    supportingText: "Swing tips and process reminders",
  },
] as const;

export const parameterDefaults = {
  aggression: "Balanced",
  riskTolerance: "Medium",
  clubSelectionBias: "Conservative",
  speakYardages: true,
  speakClubPicks: true,
  speakWind: true,
};

export const aggressionOptions = ["Safe", "Balanced", "Aggressive"] as const;
export const riskOptions = ["Low", "Medium", "High"] as const;
export const clubBiasOptions = ["Conservative", "Neutral", "Aggressive"] as const;

export const subscriptionMock = {
  planName: "Kaddie Pro",
  status: "Active",
  renewsOn: "15 Aug 2026",
  price: "€9.99 / month",
  features: [
    "Unlimited rounds",
    "Voice caddie",
    "Advanced shot insights",
    "Priority support",
  ],
  billingHistory: [
    { id: "inv-1", label: "Jul 2026", value: "€9.99" },
    { id: "inv-2", label: "Jun 2026", value: "€9.99" },
    { id: "inv-3", label: "May 2026", value: "€9.99" },
  ],
};

export const notificationDefaults = {
  pushEnabled: true,
  roundReminders: true,
  tipsAndInsights: true,
  productUpdates: false,
  marketing: false,
};

export const notificationInbox = [
  {
    id: "n1",
    title: "Your July insights are ready",
    supportingText: "3 new trends from your last 4 rounds",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Tee time reminder",
    supportingText: "Elmgreen Golf Club · tomorrow 08:12",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "n3",
    title: "Welcome to Kaddie Pro",
    supportingText: "Voice mode and advanced insights unlocked",
    time: "3 days ago",
    unread: true,
  },
  {
    id: "n4",
    title: "Club distance update",
    supportingText: "7 iron adjusted to 158 yards",
    time: "Last week",
    unread: false,
  },
];

export const privacyDefaults = {
  shareRoundStats: false,
  personalizedTips: true,
  analytics: true,
  crashReports: true,
};

export const privacyRows = [
  {
    id: "location",
    title: "Location access",
    supportingText: "Used for in-round GPS distances",
    value: "While using",
  },
  {
    id: "microphone",
    title: "Microphone",
    supportingText: "Used for voice caddie",
    value: "Allowed",
  },
  {
    id: "data-export",
    title: "Download my data",
    supportingText: "Get a copy of your rounds and preferences",
  },
  {
    id: "delete",
    title: "Delete account",
    supportingText: "Permanently remove your Kaddie account",
  },
];

export const helpTopics = [
  {
    id: "start-round",
    title: "Starting a round",
    supportingText: "Course, tees, format, and GPS setup",
  },
  {
    id: "voice",
    title: "Using voice mode",
    supportingText: "Ask for clubs, yardages, and strategy",
  },
  {
    id: "bag",
    title: "Managing your bag",
    supportingText: "Add clubs and tune distances",
  },
  {
    id: "billing",
    title: "Billing & subscription",
    supportingText: "Plans, renewals, and invoices",
  },
  {
    id: "privacy",
    title: "Privacy & data",
    supportingText: "Permissions, exports, and deletion",
  },
];

export const helpArticles = [
  {
    id: "a1",
    title: "Why is my GPS distance off?",
    body: "Make sure Location is set to While Using the App, then re-open the round so the map can snap to your tee.",
  },
  {
    id: "a2",
    title: "How do I change Kaddie’s personality?",
    body: "Go to Preferences → My Kaddie → Personality and pick Encouraging, Direct, Analytical, or Coach.",
  },
];

export const contactTopics = [
  "Round / GPS issue",
  "Subscription & billing",
  "Account access",
  "Feature request",
  "Something else",
] as const;

export const contactDefaults = {
  topicIndex: 0,
  message:
    "Hi Kaddie team — I’m seeing an issue with yardages on hole 5 at Elmgreen. Happy to share a screen recording.",
  email: "",
};

export const aboutMock = {
  appName: "Kaddie",
  version: "v1.0.0",
  build: "2026.07.15",
  tagline: "Your on-course AI caddie for smarter club decisions.",
  legal: [
    { id: "terms", title: "Terms of service" },
    { id: "privacy", title: "Privacy policy" },
    { id: "licenses", title: "Open-source licenses" },
  ],
  credits: "Made for golfers who want clear calls, not more clutter.",
};
