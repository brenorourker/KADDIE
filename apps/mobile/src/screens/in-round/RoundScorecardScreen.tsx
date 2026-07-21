import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { controlSize, spacing } from "@kaddie/ui";
import { DistancesAndPlaysLike } from "../../components/in-round/DistancesAndPlaysLike";
import { HoleHeader } from "../../components/in-round/HoleHeader";
import { ScorecardGrid } from "../../components/in-round/ScorecardGrid";
import { ShotNumberStepper } from "../../components/in-round/ShotNumberStepper";
import {
  WIND_BADGE_HEIGHT,
  WindBadge,
} from "../../components/in-round/WindBadge";
import { useRoundMap } from "../../round/RoundMapProvider";
import { inRoundColors, inRoundLayout } from "../../round/inRoundTheme";

export function RoundScorecardScreen() {
  const insets = useSafeAreaInsets();
  const {
    holes,
    currentHole,
    holeScores,
    goToHole,
    displayDistances,
    playsLikeYards,
    clubRecommendation,
    shotNumber,
    setShotNumber,
  } = useRoundMap();

  const fabClearance =
    inRoundLayout.fabBottomOffset + controlSize.lg + spacing.md;

  return (
    <View style={[styles.root, { marginTop: -insets.top }]}>
      <View style={styles.header}>
        <HoleHeader />
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: fabClearance },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <ScorecardGrid
          holes={holes}
          currentHoleNumber={currentHole.number}
          scores={holeScores}
          onSelectHole={goToHole}
        />

        <ShotNumberStepper
          value={shotNumber}
          width={226}
          centerLabel
          style={styles.shotStepper}
          onDecrement={() => setShotNumber(shotNumber - 1)}
          onIncrement={() => setShotNumber(shotNumber + 1)}
        />

        {/* Pushes distances down into the band above Kaddie / Voice FABs. */}
        <View style={styles.distancesSpacer} />

        <View style={styles.distancesBand}>
          <DistancesAndPlaysLike
            variant="scorecard"
            back={displayDistances.back}
            middle={displayDistances.middle}
            front={displayDistances.front}
            playsLikeYards={playsLikeYards}
            club={clubRecommendation}
            style={styles.distances}
          />
          <WindBadge
            speedKph={currentHole.windKph}
            bearingDeg={currentHole.windBearingDeg}
            style={styles.windBadge}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: inRoundColors.background,
  },
  header: {
    zIndex: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    gap: spacing.xl,
  },
  shotStepper: {
    alignSelf: "center",
  },
  distancesSpacer: {
    flexGrow: 1,
    minHeight: spacing.xl,
  },
  distancesBand: {
    position: "relative",
    width: "100%",
    alignItems: "center",
  },
  distances: {
    alignSelf: "center",
  },
  /** Vertically centre on the middle green / plays-like row. */
  windBadge: {
    top: "50%",
    marginTop: -(WIND_BADGE_HEIGHT / 2),
  },
});
