import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CaddieFab } from "../../components/in-round/CaddieFab";
import { RoundTabBar } from "../../components/in-round/RoundTabBar";
import { RoundMapProvider } from "../../round/RoundMapProvider";
import { inRoundColors } from "../../round/inRoundTheme";
import type { RoundTab } from "../../round/types";
import type { RoundConfig } from "../roundConfig";
import { RoundMapScreen } from "./RoundMapScreen";
import { RoundMenuScreen } from "./RoundMenuScreen";
import { RoundScorecardScreen } from "./RoundScorecardScreen";

type InRoundShellProps = {
  roundConfig: RoundConfig;
  onEndRound: () => void;
};

function InRoundShellContent({ onEndRound }: { onEndRound: () => void }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<RoundTab>("map");
  const showCaddieFab = activeTab === "scorecard";

  return (
    <View
      style={[
        styles.root,
        windowHeight > 0 ? { minHeight: windowHeight } : null,
      ]}
    >
      <View style={styles.tabPanels}>
        <View
          pointerEvents={activeTab === "map" ? "auto" : "none"}
          style={[styles.tabPanel, activeTab !== "map" && styles.tabPanelHidden]}
        >
          <RoundMapScreen />
        </View>

        <View
          pointerEvents={activeTab === "scorecard" ? "auto" : "none"}
          style={[
            styles.tabPanel,
            activeTab !== "scorecard" && styles.tabPanelHidden,
          ]}
        >
          <RoundScorecardScreen />
        </View>

        <View
          pointerEvents={activeTab === "menu" ? "auto" : "none"}
          style={[styles.tabPanel, activeTab !== "menu" && styles.tabPanelHidden]}
        >
          <RoundMenuScreen onEndRound={onEndRound} />
        </View>
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

export function InRoundShell({ roundConfig, onEndRound }: InRoundShellProps) {
  return (
    <RoundMapProvider config={roundConfig}>
      <InRoundShellContent onEndRound={onEndRound} />
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
  },
  tabPanel: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  tabPanelHidden: {
    display: "none",
  },
});
