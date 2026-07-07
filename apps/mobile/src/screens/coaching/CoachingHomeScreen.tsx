import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  BannerCard,
  Button,
  colors,
  Icon,
  iconSize,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { CoachingInsightCard } from "./components/CoachingInsightCard";
import { CoachingSectionHeader } from "./components/CoachingShared";
import {
  coachingGoals,
  coachingInsights,
  coachingRoundSummary,
  coachingWeeklyFocus,
  categoryLabels,
} from "./coachingMockData";
import type { CoachingSubRoute } from "./CoachingShell";

type CoachingHomeScreenProps = {
  onBack: () => void;
  onNavigate: (route: CoachingSubRoute) => void;
};

export function CoachingHomeScreen({ onBack, onNavigate }: CoachingHomeScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const topInsights = coachingInsights.slice(0, 3);

  return (
    <View style={styles.root}>
      <AppBar title="Coaching" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <BannerCard
          actionLabel="View summary"
          body={`${coachingRoundSummary.course} · ${coachingRoundSummary.date} — Score ${coachingRoundSummary.score} (+${coachingRoundSummary.vsPar})`}
          showDismiss={false}
          style="info"
          title="Latest round insight"
          onActionPress={() => onNavigate("round-summary")}
        />

        <View style={styles.section}>
          <CoachingSectionHeader label="This week's focus" />
          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <View style={styles.focusBadge}>
                <Text style={styles.focusBadgeText}>
                  {categoryLabels[coachingWeeklyFocus.category].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.focusGain}>
                +{coachingWeeklyFocus.strokesToGain} strokes to gain
              </Text>
            </View>
            <Text style={styles.focusTitle}>{coachingWeeklyFocus.title}</Text>
            <Text style={styles.focusSubtitle}>{coachingWeeklyFocus.subtitle}</Text>
            <Text style={styles.focusMeta}>
              {coachingWeeklyFocus.sessionsPerWeek} practice sessions recommended
            </Text>
            <Button
              label="View focus plan"
              size="md"
              style={styles.focusButton}
              trailingIcon={
                <Icon color={colors.action.onPrimary} name="chevron-right" size={iconSize.md} />
              }
              onPress={() => onNavigate("weekly-focus")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader
            actionLabel="See all"
            label="Top insights"
            onActionPress={() => onNavigate("insight-detail")}
          />
          <View style={styles.insightList}>
            {topInsights.map((insight) => (
              <CoachingInsightCard
                key={insight.id}
                compact
                insight={insight}
                onPress={() => onNavigate({ type: "insight-detail", insightId: insight.id })}
              />
            ))}
          </View>
        </View>

        <View style={styles.quickLinks}>
          <CoachingSectionHeader label="Explore" />
          <View style={styles.linkGrid}>
            <QuickLink
              icon="target-1"
              subtitle="Drills & rep targets"
              title="Practice plan"
              onPress={() => onNavigate("practice-plan")}
            />
            <QuickLink
              icon="scorecard"
              subtitle="Track improvement"
              title="Goals"
              onPress={() => onNavigate("goals")}
            />
            <QuickLink
              icon="flag"
              subtitle="Hole-by-hole tips"
              title="Course strategy"
              onPress={() => onNavigate("strategy")}
            />
            <QuickLink
              icon="pin"
              subtitle="Compare your trends"
              title="Benchmarks"
              onPress={() => onNavigate("benchmarks")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <CoachingSectionHeader label="Active goals" actionLabel="View all" onActionPress={() => onNavigate("goals")} />
          <View style={styles.goalsPreview}>
            {coachingGoals.slice(0, 2).map((goal) => (
              <View key={goal.id} style={styles.goalPreviewRow}>
                <Text style={styles.goalPreviewTitle}>{goal.title}</Text>
                <Text style={styles.goalPreviewValue}>
                  {goal.currentValue} → {goal.targetValue}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickLink({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: "target-1" | "scorecard" | "flag" | "pin";
  onPress: () => void;
}) {
  return (
    <View style={styles.quickLink}>
      <View style={styles.quickLinkIcon}>
        <Icon color={colors.text.primary} name={icon} size={iconSize.md} />
      </View>
      <Text style={styles.quickLinkTitle}>{title}</Text>
      <Text style={styles.quickLinkSubtitle}>{subtitle}</Text>
      <Button label="Open" size="sm" variant="ghost" onPress={onPress} />
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
  section: {
    gap: spacing.md,
    width: "100%",
  },
  focusCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  focusHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  focusBadge: {
    backgroundColor: colors.feedback.successBg,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxxs,
  },
  focusBadgeText: {
    ...typography.badgeLabel,
    color: colors.feedback.successFg,
  },
  focusGain: {
    ...typography.caption,
    color: colors.feedback.successFg,
  },
  focusTitle: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  focusSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  focusMeta: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  focusButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
  insightList: {
    gap: spacing.md,
  },
  quickLinks: {
    gap: spacing.md,
  },
  linkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickLink: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xxs,
    minWidth: "47%",
    padding: spacing.md,
  },
  quickLinkIcon: {
    alignItems: "center",
    backgroundColor: colors.background.muted,
    borderRadius: radii.sm,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  quickLinkTitle: {
    ...typography.titleSmall,
    color: colors.text.primary,
  },
  quickLinkSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  goalsPreview: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  goalPreviewRow: {
    gap: spacing.xxxs,
  },
  goalPreviewTitle: {
    ...typography.titleSmall,
    color: colors.text.primary,
  },
  goalPreviewValue: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
