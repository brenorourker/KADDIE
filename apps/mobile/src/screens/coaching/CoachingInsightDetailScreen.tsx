import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar, Button, colors, radii, spacing, typography } from "@kaddie/ui";
import {
  CoachingCategoryChip,
  CoachingPriorityBadge,
  CoachingStatBullet,
} from "./components/CoachingShared";
import { coachingInsights } from "./coachingMockData";
import type { CoachingInsight } from "./coachingTypes";

type CoachingInsightDetailScreenProps = {
  insight?: CoachingInsight;
  onBack: () => void;
};

export function CoachingInsightDetailScreen({
  insight = coachingInsights[0],
  onBack,
}: CoachingInsightDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  return (
    <View style={styles.root}>
      <AppBar title="Insight" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.metaRow}>
          <CoachingPriorityBadge priority={insight.priority} />
          <CoachingCategoryChip category={insight.category} />
        </View>

        <Text style={styles.headline}>{insight.headline}</Text>
        <Text style={styles.confidence}>
          Based on {insight.confidenceRounds} rounds · {insight.confidenceShots} shots
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EVIDENCE</Text>
          <View style={styles.card}>
            <CoachingStatBullet items={insight.evidence} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHAT'S HAPPENING</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>{insight.insight}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECOMMENDATION</Text>
          <View style={[styles.card, styles.recommendationCard]}>
            <Text style={styles.recommendationText}>{insight.recommendation}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRACTICE DRILL</Text>
          <View style={styles.card}>
            <Text style={styles.drillTitle}>{insight.drillTitle}</Text>
            <Text style={styles.bodyText}>{insight.drillDescription}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="See supporting shots" size="md" variant="secondary" />
          <Button label="Add to practice plan" size="md" />
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
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  headline: {
    ...typography.headingH2,
    color: colors.text.primary,
  },
  confidence: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  recommendationCard: {
    backgroundColor: colors.feedback.successBg,
    borderColor: colors.feedback.successFg,
  },
  bodyText: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  recommendationText: {
    ...typography.bodyDefault,
    color: colors.feedback.successFg,
  },
  drillTitle: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
});
