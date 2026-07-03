import type { Persona } from "./types";
import { addClubCategories } from "./data/shared";

const homeQuickActionIcons = {
  stats: require("../assets/home/icon-stats.png"),
  preferences: require("../assets/home/icon-preferences.png"),
  coaching: require("../assets/home/icon-coaching.png"),
  myBag: require("../assets/home/icon-my-bag.png"),
} as const;

export const newUserPersona: Persona = {
  id: "newUser",
  label: "New user",
  description: "First-time sign-in with an empty bag and no round history.",
  entryRoute: "login",
  flags: {
    isLoggedIn: false,
    hasVerifiedEmail: false,
    bagConfigured: false,
  },
  data: {
    auth: {
      email: "",
      password: "",
    },
    home: {
      greeting: "WELCOME",
      userName: "Charlie",
      handicap: "18",
      initials: "CH",
      quickActions: [
        {
          id: "stats",
          title: "Stats",
          subtitle: "Play a round to unlock stats",
          icon: homeQuickActionIcons.stats,
        },
        {
          id: "preferences",
          title: "Preferences",
          subtitle: "App settings and profile details",
          icon: homeQuickActionIcons.preferences,
        },
        {
          id: "coaching",
          title: "Coaching",
          subtitle: "Tips to get started",
          icon: homeQuickActionIcons.coaching,
        },
        {
          id: "my-bag",
          title: "My bag",
          subtitle: "Add your first clubs",
          icon: homeQuickActionIcons.myBag,
        },
      ],
    },
    profile: {
      fullName: "Charlie",
      initials: "CH",
      club: "Not set",
      handicap: "18",
      rounds: 0,
      achievements: 0,
      suggestions: [],
    },
    bag: {
      intro: "Add clubs to your bag to get started. You can carry up to 14 clubs.",
      sections: [],
    },
    preferences: {
      user: {
        fullName: "Charlie",
        email: "charlie@example.com",
        initials: "CH",
      },
      gameSettings: {
        appAppearance: "Light",
      },
      myKaddie: {
        language: "English",
        personality: "Encouraging",
      },
      account: {
        subscription: "Free",
        notificationCount: 0,
        linkedAccount: "None",
      },
      support: {
        version: "v1.0.0",
      },
    },
    clubDetails: {},
    addClub: {
      categories: addClubCategories,
      defaultSelectedClubIds: [],
    },
    round: {
      name: "Charlie",
      course: "elmgreen",
      format: "stroke-gross",
      tees: "blue",
      golfers: "Charlie",
    },
  },
};

export const onboardingPersona: Persona = {
  id: "onboarding",
  label: "New user onboarding",
  description: "Profile setup step with name, handicap, and home club fields.",
  entryRoute: "onboarding",
  flags: {
    isLoggedIn: false,
    hasVerifiedEmail: true,
    bagConfigured: false,
  },
  data: {
    ...newUserPersona.data,
    auth: {
      email: "charlie@example.com",
      password: "",
    },
    profile: {
      fullName: "",
      initials: "",
      club: "",
      handicap: "18",
      rounds: 0,
      achievements: 0,
      suggestions: [],
    },
  },
};
