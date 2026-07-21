import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInRoundChrome } from "../../app/AppChrome";
import { CaddieFab } from "../../components/in-round/CaddieFab";
import { RoundTabBar } from "../../components/in-round/RoundTabBar";
import { useTabSlideProgress } from "../../round/hooks/useTabSlideProgress";
import { RoundMapProvider } from "../../round/RoundMapProvider";
import { inRoundColors } from "../../round/inRoundTheme";
import type { RoundTab } from "../../round/types";
import type { RoundConfig } from "../roundConfig";
import { PreferencesScreen } from "../PreferencesScreen";
import { ProfileScreen } from "../ProfileScreen";
import { RoundMapScreen } from "./RoundMapScreen";
import { RoundMenuScreen } from "./RoundMenuScreen";
import { RoundScorecardScreen } from "./RoundScorecardScreen";

type InRoundShellProps = {
  roundConfig: RoundConfig;
  /** False while the round is paused on the home screen. */
  isActive?: boolean;
  onLeaveRound: () => void;
  onEndRound: () => void;
  onLogOut: () => void;
  onUpdateRoundConfig: (config: RoundConfig) => void;
};

type InRoundOverlay = "none" | "preferences" | "profile";

function InRoundShellContent({
  isActive = true,
  onLeaveRound,
  onEndRound,
  onLogOut,
}: {
  isActive?: boolean;
  onLeaveRound: () => void;
  onEndRound: () => void;
  onLogOut: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RoundTab>("map");
  const [overlay, setOverlay] = useState<InRoundOverlay>("none");
  const showCaddieFab = activeTab === "scorecard" && overlay === "none";
  const darkChrome = isActive && overlay === "none";

  useInRoundChrome(darkChrome);

  const scorecardSlide = useTabSlideProgress(
    activeTab === "scorecard",
    "from-top",
  );
  const menuSlide = useTabSlideProgress(activeTab === "menu", "from-bottom");

  // Drop overlays when pausing so no modal portal is left blocking touches on resume.
  useEffect(() => {
    if (!isActive) {
      setOverlay("none");
    }
  }, [isActive]);

  if (overlay === "preferences") {
    return (
      <PreferencesScreen
        onBack={() => setOverlay("none")}
        onOpenProfile={() => setOverlay("profile")}
      />
    );
  }

  if (overlay === "profile") {
    return (
      <ProfileScreen
        onBack={() => setOverlay("preferences")}
        onLogOut={onLogOut}
      />
    );
  }

  return (
    <View
      style={[
        styles.root,
        // Extend the shell (and tab bar background) into the home-indicator area.
        // App.tsx wraps the tree in SafeAreaView, so counteract its bottom inset here.
        insets.bottom > 0 ? { marginBottom: -insets.bottom } : null,
      ]}
    >
      <View style={styles.tabPanels}>
        <View
          pointerEvents={activeTab === "map" ? "auto" : "none"}
          style={styles.tabPanel}
        >
          <RoundMapScreen />
        </View>

        <Animated.View
          pointerEvents={activeTab === "scorecard" ? "auto" : "none"}
          style={[styles.overlayPanel, scorecardSlide.style]}
        >
          <RoundScorecardScreen />
        </Animated.View>

        <Animated.View
          pointerEvents={activeTab === "menu" ? "auto" : "none"}
          style={[styles.overlayPanel, menuSlide.style]}
        >
          <RoundMenuScreen
            isActive={isActive && activeTab === "menu"}
            onLeaveRound={onLeaveRound}
            onEndRound={onEndRound}
            onOpenPreferences={() => setOverlay("preferences")}
          />
        </Animated.View>
      </View>

      {showCaddieFab ? <CaddieFab bottomInset={insets.bottom} /> : null}

      <RoundTabBar
        activeTab={activeTab}
        bottomInset={insets.bottom}
        onTabChange={setActiveTab}
      />
    </View>
  );
}

export function InRoundShell({
  roundConfig,
  isActive = true,
  onLeaveRound,
  onEndRound,
  onLogOut,
  onUpdateRoundConfig,
}: InRoundShellProps) {
  return (
    <RoundMapProvider config={roundConfig} onConfigChange={onUpdateRoundConfig}>
      <InRoundShellContent
        isActive={isActive}
        onLeaveRound={onLeaveRound}
        onEndRound={onEndRound}
        onLogOut={onLogOut}
      />
    </RoundMapProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: inRoundColors.background,
  },
  tabPanels: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  tabPanel: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayPanel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: inRoundColors.background,
  },
});
