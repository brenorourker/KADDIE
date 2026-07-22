import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ThemeProvider,
  type AppearancePreference,
} from "@kaddie/ui";

const STORAGE_KEY = "kaddie.appearance";

type AppearanceContextValue = {
  appearance: AppearancePreference;
  setAppearance: (appearance: AppearancePreference) => void;
  ready: boolean;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] =
    useState<AppearancePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setAppearanceState(stored);
        }
      })
      .catch(() => {
        // Ignore storage failures — stay on system default.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setAppearance = useCallback((next: AppearancePreference) => {
    setAppearanceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Ignore persistence failures.
    });
  }, []);

  const value = useMemo(
    () => ({ appearance, setAppearance, ready }),
    [appearance, ready, setAppearance],
  );

  return (
    <AppearanceContext.Provider value={value}>
      <ThemeProvider appearance={appearance} onAppearanceChange={setAppearance}>
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}
