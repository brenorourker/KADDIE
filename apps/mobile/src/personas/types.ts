import type { ImageSourcePropType } from "react-native";
import type { AppRoute } from "../app/routes";
import type { RoundConfig } from "../screens/roundConfig";

export type PersonaFlags = {
  isLoggedIn?: boolean;
  hasVerifiedEmail?: boolean;
  bagConfigured?: boolean;
};

export type HomePersonaData = {
  greeting: string;
  userName: string;
  handicap: string;
  initials: string;
  quickActions: ReadonlyArray<{
    id: string;
    title: string;
    subtitle: string;
    icon: ImageSourcePropType;
  }>;
};

export type ProfilePersonaData = {
  fullName: string;
  initials: string;
  club: string;
  handicap: string;
  rounds: number;
  achievements: number;
  suggestions: ReadonlyArray<{
    id: string;
    name: string;
    initials: string;
    handicap: string;
    avatarBackgroundColor: string;
    avatarTextColor: string;
  }>;
};

export type BagClub = {
  id: string;
  title: string;
  model: string;
  image: ImageSourcePropType;
};

export type BagSection = {
  id: string;
  layout: "single" | "group";
  clubs: BagClub[];
};

export type BagPersonaData = {
  intro: string;
  sections: BagSection[];
};

export type PreferencesPersonaData = {
  user: {
    fullName: string;
    email: string;
    initials: string;
  };
  gameSettings: {
    appAppearance: string;
  };
  myKaddie: {
    language: string;
    personality: string;
  };
  account: {
    subscription: string;
    notificationCount: number;
    linkedAccount: string;
  };
  support: {
    version: string;
  };
};

export type ClubShotType = {
  id: string;
  label: string;
  distance: number;
};

export type ClubDetails = {
  id: string;
  intro: string;
  make: string;
  name: string;
  /** Standard full-swing carry distance (yards). */
  distance: number;
  /** Extra shot shapes / partials for richer club picking. */
  shotTypes?: ClubShotType[];
};

export type AddClubOption = {
  id: string;
  label: string;
};

export type AddClubCategory = {
  id: string;
  title: string;
  clubs: AddClubOption[];
};

export type AddClubPersonaData = {
  categories: AddClubCategory[];
  defaultSelectedClubIds: string[];
};

export type AuthPersonaData = {
  email: string;
  password: string;
};

export type PersonaData = {
  home: HomePersonaData;
  profile: ProfilePersonaData;
  bag: BagPersonaData;
  preferences: PreferencesPersonaData;
  clubDetails: Record<string, ClubDetails>;
  addClub: AddClubPersonaData;
  round: RoundConfig;
  auth: AuthPersonaData;
};

export type Persona = {
  id: string;
  label: string;
  description: string;
  entryRoute: AppRoute;
  data: PersonaData;
  flags?: PersonaFlags;
};
