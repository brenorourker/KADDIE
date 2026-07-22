import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { lightColors, useColors, useTheme } from "@kaddie/ui";
import { AppearanceProvider } from "./src/app/AppearanceProvider";
import { AppChromeProvider, useAppChrome } from "./src/app/AppChrome";
import { AppShell } from "./src/app/AppShell";
import { inRoundColors } from "./src/round/inRoundTheme";
import { SplashScreen } from "./src/screens/SplashScreen";

const MIN_SPLASH_MS = 1500;

export function App() {
  const splashStartedAt = useRef(Date.now());
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    const elapsed = Date.now() - splashStartedAt.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
    const timer = setTimeout(() => setSplashComplete(true), remaining);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!splashComplete) {
    return (
      <SafeAreaProvider>
        <View style={styles.splashRoot}>
          <SplashScreen showText={fontsLoaded} />
          <StatusBar style="dark" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <AppChromeProvider>
          <AppWithChrome />
        </AppChromeProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}

function AppWithChrome() {
  const { chrome } = useAppChrome();
  const { resolvedScheme } = useTheme();
  const colors = useColors();
  const inRound = chrome === "in-round";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.surfaceMuted },
        inRound && styles.containerInRound,
      ]}
    >
      <AppShell />
      <StatusBar
        style={inRound || resolvedScheme === "dark" ? "light" : "dark"}
        backgroundColor={
          inRound ? inRoundColors.background : colors.surfaceMuted
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashRoot: {
    flex: 1,
    backgroundColor: lightColors.action.primary,
  },
  container: {
    flex: 1,
  },
  containerInRound: {
    backgroundColor: inRoundColors.background,
  },
});
