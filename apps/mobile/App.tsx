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
import { colors } from "@kaddie/ui";
import { AppShell } from "./src/app/AppShell";
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
      <SafeAreaView style={styles.container}>
        <AppShell />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashRoot: {
    flex: 1,
    backgroundColor: colors.action.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
  },
});
