export type ColorTokens = {
  action: {
    primary: string;
    primaryPressed: string;
    onPrimary: string;
    onSecondary: string;
    onGhost: string;
    ghostPressed: string;
    destructive: string;
    destructivePressed: string;
    onDestructive: string;
    disabled: string;
    onDisabled: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };
  background: {
    surface: string;
    muted: string;
    accentSubtle: string;
  };
  border: {
    default: string;
    strong: string;
    focus: string;
    error: string;
  };
  feedback: {
    error: string;
    errorBg: string;
    successBg: string;
    successFg: string;
    infoBg: string;
    infoFg: string;
    warningBg: string;
    warningFg: string;
  };
  surface: string;
  surfaceMuted: string;
  textMuted: string;
  borderLegacy: string;
};

export const lightColors: ColorTokens = {
  action: {
    primary: "#38E33C",
    primaryPressed: "#2FC933",
    onPrimary: "#000000",
    onSecondary: "#020617",
    onGhost: "#0F172A",
    ghostPressed: "#F1F5F9",
    destructive: "#EF4444",
    destructivePressed: "#DC2626",
    onDestructive: "#FFFFFF",
    disabled: "#E2E8F0",
    onDisabled: "#94A3B8",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    tertiary: "#64748B",
    disabled: "#94A3B8",
  },
  background: {
    surface: "#FFFFFF",
    muted: "#F1F5F9",
    accentSubtle: "#F7EBDA",
  },
  border: {
    default: "#E2E8F0",
    strong: "#CBD5E1",
    focus: "#38E33C",
    error: "#EF4444",
  },
  feedback: {
    error: "#B91C1C",
    errorBg: "#FEF2F2",
    successBg: "#ECFDEC",
    successFg: "#239626",
    infoBg: "#EFF6FF",
    infoFg: "#1D4ED8",
    warningBg: "#FFFBEB",
    warningFg: "#B45309",
  },
  surface: "#FFFFFF",
  surfaceMuted: "#F3F4F6",
  textMuted: "#6B7280",
  borderLegacy: "#E5E7EB",
};

/** App chrome dark palette (not used by in-round map UI). */
export const darkColors: ColorTokens = {
  action: {
    primary: "#38E33C",
    primaryPressed: "#2FC933",
    onPrimary: "#000000",
    onSecondary: "#F8FAFC",
    onGhost: "#F8FAFC",
    ghostPressed: "#1E293B",
    destructive: "#F87171",
    destructivePressed: "#EF4444",
    onDestructive: "#FFFFFF",
    disabled: "#334155",
    onDisabled: "#64748B",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#CBD5E1",
    tertiary: "#94A3B8",
    disabled: "#64748B",
  },
  background: {
    surface: "#1E293B",
    muted: "#0F172A",
    accentSubtle: "#3D3429",
  },
  border: {
    default: "#334155",
    strong: "#475569",
    focus: "#38E33C",
    error: "#F87171",
  },
  feedback: {
    error: "#FCA5A5",
    errorBg: "#450A0A",
    successBg: "#052E16",
    successFg: "#4ADE80",
    infoBg: "#172554",
    infoFg: "#93C5FD",
    warningBg: "#422006",
    warningFg: "#FBBF24",
  },
  surface: "#1E293B",
  surfaceMuted: "#0F172A",
  textMuted: "#94A3B8",
  borderLegacy: "#334155",
};

/** @deprecated Prefer `useColors()` — static light palette for catalogs / legacy imports. */
export const colors = lightColors;
