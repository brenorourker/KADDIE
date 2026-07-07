import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar, Button, colors, Icon, iconSize, radii, spacing, typography } from "@kaddie/ui";
import { CoachingCategoryChip } from "./components/CoachingShared";
import {
  coachingDrills,
  coachingWeeklyFocus,
  categoryLabels,
} from "./coachingMockData";

type CoachingWeeklyFocusScreenProps = {
  onBack: () => void;
  onOpenPracticePlan: () => void;
};

export function CoachingWeeklyFocusScreen({
  onBack,
  onOpenPracticePlan,
}: CoachingWeeklyFocusScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const focusDrills = coachingDrills.filter((drill) =>
    coachingWeeklyFocus.drillIds.includes(drill.id),
  );

  return (
    <View style={styles.root}>
      <AppBar title="Weekly focus" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.hero}>
          <CoachingCategoryChip category={coachingWeeklyFocus.category} />
          <Text style={styles.heroTitle}>{coachingWeeklyFocus.title}</Text>
          <Text style={styles.heroSubtitle}>{coachingWeeklyFocus.subtitle}</Text>

          <View style={styles.statsRow}>
            <StatBlock label="Strokes to gain" value={`+${coachingWeeklyFocus.strokesToGain}`} />
            <StatBlock
              label="Sessions / week"
              value={String(coachingWeeklyFocus.sessionsPerWeek)}
            />
            <StatBlock
              label="Category"
              value={categoryLabels[coachingWeeklyFocus.category]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHY THIS FOCUS</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>
              Your approach play from 125–175 yds is costing 1.8 more strokes per round than
              your baseline. Short-left misses and under-clubbing on elevated greens are the
              main drivers — fixing this has the highest projected impact on your scoring
              average.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECOMMENDED DRILLS</Text>
          <View style={styles.drillList}>
            {focusDrills.map((drill, index) => (
              <View key={drill.id} style={styles.drillCard}>
                <View style={styles.drillHeader}>
                  <View style={styles.drillNumber}>
                    <Text style={styles.drillNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.drillContent}>
                    <Text style={styles.drillTitle}>{drill.title}</Text>
                    <Text style={styles.drillMeta}>
                      {drill.durationMinutes} min · {drill.reps}
                    </Text>
                  </View>
                </View>
                <Text style={styles.drillDescription}>{drill.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ON-COURSE STRATEGY</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>
              Add one club from 150–180 yds when the pin is back or the green is elevated.
              Aim centre-green on holes 11, 14, and 16 at Elmgreen — your miss pattern is
              short-left on all three.
            </Text>
          </View>
        </View>

        <Button
          label="Open full practice plan"
          size="md"
          trailingIcon={
            <Icon color={colors.action.onPrimary} name="chevron-right" size={iconSize.md} />
          }
          onPress={onOpenPracticePlan}
        />
      </ScrollView>
    </View>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  hero: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  heroTitle: {
    ...typography.headingH2,
    color: colors.text.primary,
  },
  heroSubtitle: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  statBlock: {
    backgroundColor: colors.background.muted,
    borderRadius: radii.sm,
    flex: 1,
    gap: spacing.xxxs,
    padding: spacing.sm,
  },
  statValue: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  statLabel: {
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
    padding: spacing.lg,
  },
  bodyText: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  drillList: {
    gap: spacing.md,
  },
  drillCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  drillHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  drillNumber: {
    alignItems: "center",
    backgroundColor: colors.action.primary,
    borderRadius: radii.full,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  drillNumberText: {
    ...typography.labelSmall,
    color: colors.action.onPrimary,
  },
  drillContent: {
    flex: 1,
    gap: spacing.xxxs,
  },
  drillTitle: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  drillMeta: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  drillDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
