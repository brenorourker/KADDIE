import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar, Button, colors, radii, spacing, typography } from "@kaddie/ui";
import {
  CoachingCategoryChip,
  CoachingProgressBar,
  CoachingSectionHeader,
} from "./components/CoachingShared";
import { coachingGoals } from "./coachingMockData";

type CoachingGoalsScreenProps = {
  onBack: () => void;
};

const trendLabels = {
  improving: "Improving",
  stable: "Stable",
  declining: "Needs attention",
};

const trendColors = {
  improving: colors.feedback.successFg,
  stable: colors.text.tertiary,
  declining: colors.feedback.error,
};

export function CoachingGoalsScreen({ onBack }: CoachingGoalsScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  return (
    <View style={styles.root}>
      <AppBar title="Goals" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Track your progress</Text>
          <Text style={styles.introBody}>
            Goals are set automatically from your coaching insights. Complete focus blocks to
            see before/after improvements.
          </Text>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader label="Active goals" />
          <View style={styles.goalList}>
            {coachingGoals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <CoachingCategoryChip category={goal.category} />
                  <Text style={[styles.trend, { color: trendColors[goal.trend] }]}>
                    {trendLabels[goal.trend]}
                  </Text>
                </View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.goalValues}>
                  <View>
                    <Text style={styles.valueLabel}>Current</Text>
                    <Text style={styles.valueText}>{goal.currentValue}</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View>
                    <Text style={styles.valueLabel}>Target</Text>
                    <Text style={styles.valueText}>{goal.targetValue}</Text>
                  </View>
                </View>
                <CoachingProgressBar progress={goal.progress} trend={goal.trend} />
                <Text style={styles.progressLabel}>
                  {Math.round(goal.progress * 100)}% to target
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader label="Completed focus blocks" />
          <View style={styles.completedCard}>
            <CompletedBlock
              after="3.8 3-putts/round"
              before="4.6 3-putts/round"
              period="Apr focus: Lag putting"
            />
            <CompletedBlock
              after="29% scrambling"
              before="24% scrambling"
              isLast
              period="Mar focus: Greenside bunkers"
            />
          </View>
        </View>

        <Button label="Set custom goal" size="md" variant="secondary" />
      </ScrollView>
    </View>
  );
}

function CompletedBlock({
  period,
  before,
  after,
  isLast = false,
}: {
  period: string;
  before: string;
  after: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.completedRow, !isLast && styles.completedRowBorder]}>
      <Text style={styles.completedPeriod}>{period}</Text>
      <Text style={styles.completedStats}>
        {before} → <Text style={styles.completedAfter}>{after}</Text>
      </Text>
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
    gap: spacing.xl,
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
  section: {
    gap: spacing.md,
  },
  goalList: {
    gap: spacing.md,
  },
  goalCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  goalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trend: {
    ...typography.caption,
  },
  goalTitle: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  goalValues: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
    paddingVertical: spacing.xs,
  },
  valueLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  valueText: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  arrow: {
    ...typography.titleDefault,
    color: colors.text.tertiary,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  completedCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  completedRow: {
    gap: spacing.xxs,
    padding: spacing.lg,
  },
  completedRowBorder: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  completedPeriod: {
    ...typography.titleSmall,
    color: colors.text.primary,
  },
  completedStats: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  completedAfter: {
    color: colors.feedback.successFg,
    fontWeight: "600",
  },
});
