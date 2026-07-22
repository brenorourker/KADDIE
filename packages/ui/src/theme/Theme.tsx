import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useColorScheme, StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from "react-native";
import {
  darkColors,
  lightColors,
  type ColorTokens,
} from "../tokens/colors";

export type AppearancePreference = "light" | "dark" | "system";
export type ResolvedColorScheme = "light" | "dark";

type ThemeContextValue = {
  appearance: AppearancePreference;
  resolvedScheme: ResolvedColorScheme;
  colors: ColorTokens;
  setAppearance?: (appearance: AppearancePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  appearance: "system",
  resolvedScheme: "light",
  colors: lightColors,
});

export type ThemeProviderProps = {
  children: ReactNode;
  /** User preference: light, dark, or follow system. */
  appearance?: AppearancePreference;
  /** Force resolved mode (playground QA). Overrides appearance when set. */
  forcedScheme?: ResolvedColorScheme;
  onAppearanceChange?: (appearance: AppearancePreference) => void;
};

export function ThemeProvider({
  children,
  appearance = "system",
  forcedScheme,
  onAppearanceChange,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolvedScheme: ResolvedColorScheme =
    forcedScheme ??
    (appearance === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : appearance);

  const value = useMemo<ThemeContextValue>(
    () => ({
      appearance,
      resolvedScheme,
      colors: resolvedScheme === "dark" ? darkColors : lightColors,
      setAppearance: onAppearanceChange,
    }),
    [appearance, onAppearanceChange, resolvedScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Themed color tokens; falls back to light when outside ThemeProvider. */
export function useColors(): ColorTokens {
  return useContext(ThemeContext).colors;
}

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/** Build StyleSheet from current theme colors (recreates when scheme changes). */
export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (colors: ColorTokens) => T | NamedStyles<T>,
): T {
  const colors = useColors();
  return useMemo(
    () => StyleSheet.create(factory(colors)) as T,
    // factory is expected to be stable (inline arrow ok if it only closes over constants)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors],
  );
}
