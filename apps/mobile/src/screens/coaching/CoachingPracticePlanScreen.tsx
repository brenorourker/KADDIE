import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Accordion,
  AppBar,
  colors,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { CoachingCategoryChip } from "./components/CoachingShared";
import { coachingDrills } from "./coachingMockData";

type CoachingPracticePlanScreenProps = {
  onBack: () => void;
};

export function CoachingPracticePlanScreen({ onBack }: CoachingPracticePlanScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [expandedId, setExpandedId] = useState<string | null>(coachingDrills[0]?.id ?? null);

  return (
    <View style={styles.root}>
      <AppBar title="Practice plan" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Your personalised drills</Text>
          <Text style={styles.introBody}>
            3 sessions per week · ~60 min total. Drills are tied to your top coaching insights.
          </Text>
        </View>

        <View style={styles.drillList}>
          {coachingDrills.map((drill) => (
            <View key={drill.id} style={styles.drillWrapper}>
              <View style={styles.drillMeta}>
                <CoachingCategoryChip category={drill.category} />
                <Text style={styles.drillDuration}>
                  {drill.durationMinutes} min · {drill.reps}
                </Text>
              </View>
              <Accordion
                expanded={expandedId === drill.id}
                title={drill.title}
                onExpandedChange={(open) => setExpandedId(open ? drill.id : null)}
              >
                <View style={styles.accordionContent}>
                  <Text style={styles.drillDescription}>{drill.description}</Text>
                  <Text style={styles.stepsLabel}>STEPS</Text>
                  {drill.steps.map((step, index) => (
                    <View key={step} style={styles.stepRow}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </Accordion>
            </View>
          ))}
        </View>

        <View style={styles.weekPlan}>
          <Text style={styles.sectionLabel}>SUGGESTED WEEKLY SCHEDULE</Text>
          <View style={styles.scheduleCard}>
            <ScheduleRow day="Mon" drill="150-yd distance ladder" duration="25 min" />
            <ScheduleRow day="Wed" drill="Wedge distance matrix" duration="20 min" />
            <ScheduleRow day="Sat" drill="Elevated green club-up" duration="15 min" isLast />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ScheduleRow({
  day,
  drill,
  duration,
  isLast = false,
}: {
  day: string;
  drill: string;
  duration: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.scheduleRow, !isLast && styles.scheduleRowBorder]}>
      <Text style={styles.scheduleDay}>{day}</Text>
      <View style={styles.scheduleContent}>
        <Text style={styles.scheduleDrill}>{drill}</Text>
        <Text style={styles.scheduleDuration}>{duration}</Text>
      </View>
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
  drillList: {
    gap: spacing.md,
  },
  drillWrapper: {
    gap: spacing.xs,
  },
  drillMeta: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xxs,
  },
  drillDuration: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  accordionContent: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  drillDescription: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  stepsLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  stepRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  stepNumber: {
    ...typography.labelSmall,
    backgroundColor: colors.background.muted,
    borderRadius: radii.full,
    color: colors.text.primary,
    height: 22,
    lineHeight: 22,
    overflow: "hidden",
    textAlign: "center",
    width: 22,
  },
  stepText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  weekPlan: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  scheduleCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  scheduleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  scheduleRowBorder: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  scheduleDay: {
    ...typography.titleSmall,
    color: colors.text.primary,
    width: 36,
  },
  scheduleContent: {
    flex: 1,
    gap: spacing.xxxs,
  },
  scheduleDrill: {
    ...typography.bodyDefault,
    color: colors.text.primary,
  },
  scheduleDuration: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
