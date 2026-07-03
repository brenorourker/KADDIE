import type { Persona } from "./types";
import {
  addClubCategories,
  golfCourseImage,
  seasonedBagSections,
  seasonedClubDetails,
  seasonedSelectedClubIds,
} from "./data/shared";

const homeQuickActionIcons = {
  stats: require("../assets/home/icon-stats.png"),
  preferences: require("../assets/home/icon-preferences.png"),
  coaching: require("../assets/home/icon-coaching.png"),
  myBag: require("../assets/home/icon-my-bag.png"),
} as const;

export const seasonedUserPersona: Persona = {
  id: "seasonedUser",
  label: "Seasoned user",
  description: "Returning player with a full bag, profile stats, and round history.",
  entryRoute: "main",
  flags: {
    isLoggedIn: true,
    hasVerifiedEmail: true,
    bagConfigured: true,
  },
  data: {
    auth: {
      email: "brenorourker@gmail.com",
      password: "password123",
    },
    home: {
      greeting: "GOOD MORNING",
      userName: "Brendan",
      handicap: "10.0",
      initials: "BR",
      quickActions: [
        {
          id: "stats",
          title: "Stats",
          subtitle: "Review recent scores & statistics",
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
          subtitle: "Tips & insights to improve faster",
          icon: homeQuickActionIcons.coaching,
        },
        {
          id: "my-bag",
          title: "My bag",
          subtitle: "Set up your clubs and distances",
          icon: homeQuickActionIcons.myBag,
        },
      ],
    },
    profile: {
      fullName: "Brendan O'Rourke",
      initials: "BR",
      club: "Elmgreen Golf Club",
      handicap: "10.0",
      rounds: 24,
      achievements: 6,
      suggestions: [
        {
          id: "charlie",
          name: "Charlie Horkan",
          initials: "CH",
          handicap: "15.1",
          avatarBackgroundColor: "#38E33C",
          avatarTextColor: "#000000",
        },
        {
          id: "ciaran",
          name: "Ciaran Connelly",
          initials: "CC",
          handicap: "23.9",
          avatarBackgroundColor: "#32ADE6",
          avatarTextColor: "#000000",
        },
        {
          id: "stephen",
          name: "Stephen O'Rourke",
          initials: "SO",
          handicap: "19.8",
          avatarBackgroundColor: "#ECCBA4",
          avatarTextColor: "#8B5C32",
        },
      ],
    },
    bag: {
      intro:
        "The Rules of Golf permit a maximum of 14 clubs in your bag during a competitive round.",
      sections: seasonedBagSections,
    },
    preferences: {
      user: {
        fullName: "Brendan O'Rourke",
        email: "brenorourker@gmail.com",
        initials: "BR",
      },
      gameSettings: {
        appAppearance: "Light",
      },
      myKaddie: {
        language: "English",
        personality: "Direct",
      },
      account: {
        subscription: "Pro",
        notificationCount: 3,
        linkedAccount: "Google",
      },
      support: {
        version: "v1.0.0",
      },
    },
    clubDetails: seasonedClubDetails,
    addClub: {
      categories: addClubCategories,
      defaultSelectedClubIds: seasonedSelectedClubIds,
    },
    round: {
      name: "Brendan O'Rourke",
      course: "elmgreen",
      format: "stroke-gross",
      tees: "blue",
      golfers: "Brendan O'Rourke",
    },
  },
};

export { golfCourseImage };
