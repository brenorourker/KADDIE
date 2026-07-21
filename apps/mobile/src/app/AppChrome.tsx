import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppChrome = "default" | "in-round";

type AppChromeContextValue = {
  chrome: AppChrome;
  setChrome: (chrome: AppChrome) => void;
};

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function AppChromeProvider({ children }: { children: ReactNode }) {
  const [chrome, setChromeState] = useState<AppChrome>("default");

  const setChrome = useCallback((next: AppChrome) => {
    setChromeState(next);
  }, []);

  const value = useMemo(
    () => ({ chrome, setChrome }),
    [chrome, setChrome],
  );

  return (
    <AppChromeContext.Provider value={value}>{children}</AppChromeContext.Provider>
  );
}

export function useAppChrome() {
  const context = useContext(AppChromeContext);
  if (!context) {
    throw new Error("useAppChrome must be used within AppChromeProvider");
  }
  return context;
}

/** Keeps root SafeArea / StatusBar in sync with in-round dark chrome. */
export function useInRoundChrome(active: boolean) {
  const { setChrome } = useAppChrome();

  useEffect(() => {
    if (!active) {
      return;
    }

    setChrome("in-round");
    return () => setChrome("default");
  }, [active, setChrome]);
}
