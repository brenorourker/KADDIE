import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar, colors, radii, spacing, typography } from "@kaddie/ui";
import { coachingBenchmarks } from "./coachingMockData";

type CoachingBenchmarksScreenProps = {
  onBack: () => void;
};

const trendIcons = {
  better: "↓",
  worse: "↑",
  neutral: "→",
};

const trendColors = {
  better: colors.feedback.successFg,
  worse: colors.feedback.error,
  neutral: colors.text.tertiary,
};

export function CoachingBenchmarksScreen({ onBack }: CoachingBenchmarksScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  return (
    <View style={styles.root}>
      <AppBar title="Benchmarks" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>How you compare</Text>
          <Text style={styles.introBody}>
            Last 10 rounds vs your personal baseline and golfers at a similar handicap (10.0).
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.labelCell]}>Stat</Text>
            <Text style={styles.headerCell}>You</Text>
            <Text style={styles.headerCell}>Baseline</Text>
            <Text style={styles.headerCell}>Peers</Text>
          </View>
          {coachingBenchmarks.map((row, index) => (
            <View
              key={row.label}
              style={[styles.tableRow, index < coachingBenchmarks.length - 1 && styles.tableRowBorder]}
            >
              <Text style={[styles.cell, styles.labelCell]}>{row.label}</Text>
              <View style={styles.valueCell}>
                <Text style={styles.cell}>{row.userValue}</Text>
                <Text style={[styles.trend, { color: trendColors[row.trend] }]}>
                  {trendIcons[row.trend]}
                </Text>
              </View>
              <Text style={styles.cell}>{row.baselineValue}</Text>
              <Text style={styles.cell}>{row.peerValue}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendText}>
            ↓ Improving vs baseline · ↑ Declining vs baseline · → Stable
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.muted,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  intro: {
    gap: spacing.xs,
  },
  introTitle: {
    ...typography.headingH2,
    color: colors.text.primary,
  },
  introBody: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  table: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: colors.background.muted,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerCell: {
    ...typography.caption,
    color: colors.text.tertiary,
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  labelCell: {
    flex: 1.4,
    textAlign: "left",
  },
  tableRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  tableRowBorder: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  cell: {
    ...typography.bodySmall,
    color: colors.text.primary,
    flex: 1,
    textAlign: "center",
  },
  valueCell: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.xxs,
    justifyContent: "center",
  },
  trend: {
    ...typography.caption,
    fontWeight: "700",
  },
  legend: {
    paddingHorizontal: spacing.xs,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
