import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar, Button, colors, radii, spacing, typography } from "@kaddie/ui";
import { CoachingSectionHeader, CoachingStatBullet } from "./components/CoachingShared";
import { coachingRoundSummary } from "./coachingMockData";

type CoachingRoundSummaryScreenProps = {
  onBack: () => void;
};

export function CoachingRoundSummaryScreen({ onBack }: CoachingRoundSummaryScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const summary = coachingRoundSummary;

  return (
    <View style={styles.root}>
      <AppBar title="Round summary" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.scoreCard}>
          <View>
            <Text style={styles.course}>{summary.course}</Text>
            <Text style={styles.date}>{summary.date}</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={styles.score}>{summary.score}</Text>
            <Text style={styles.vsPar}>+{summary.vsPar}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.coachLabel}>COACH SUMMARY</Text>
          <View style={styles.narrativeCard}>
            <Text style={styles.narrative}>{summary.narrative}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader label="Highlights" />
          <View style={styles.listCard}>
            <CoachingStatBullet items={summary.highlights} />
          </View>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader label="Focus areas" />
          <View style={[styles.listCard, styles.focusCard]}>
            <CoachingStatBullet items={summary.focusAreas} />
          </View>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader label="Suggested next steps" />
          <View style={styles.nextSteps}>
            <NextStep
              description="Add one club on elevated approaches — holes 11, 14, 16"
              title="Approach play focus"
            />
            <NextStep
              description="Use hybrid on hole 10 — you've missed right 3 of last 5"
              isLast
              title="Tee shot adjustment"
            />
          </View>
        </View>

        <Button label="View supporting statistics" size="md" variant="secondary" />
      </ScrollView>
    </View>
  );
}

function NextStep({
  title,
  description,
  isLast = false,
}: {
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.nextStepRow, !isLast && styles.nextStepBorder]}>
      <Text style={styles.nextStepTitle}>{title}</Text>
      <Text style={styles.nextStepDescription}>{description}</Text>
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
  scoreCard: {
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  course: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  date: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  scoreBlock: {
    alignItems: "flex-end",
  },
  score: {
    ...typography.displayLarge,
    color: colors.text.primary,
    fontSize: 40,
    lineHeight: 48,
  },
  vsPar: {
    ...typography.titleDefault,
    color: colors.text.secondary,
  },
  section: {
    gap: spacing.sm,
  },
  coachLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  narrativeCard: {
    backgroundColor: colors.action.primary,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  narrative: {
    ...typography.bodyDefault,
    color: colors.action.onPrimary,
  },
  listCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  focusCard: {
    backgroundColor: colors.feedback.warningBg,
    borderColor: colors.feedback.warningFg,
  },
  nextSteps: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  nextStepRow: {
    gap: spacing.xxxs,
    padding: spacing.lg,
  },
  nextStepBorder: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  nextStepTitle: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  nextStepDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
