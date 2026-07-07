import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, Icon, iconSize, radii, spacing, typography } from "@kaddie/ui";
import type { CoachingInsight } from "../coachingTypes";
import {
  CoachingCategoryChip,
  CoachingImpactPill,
  CoachingPriorityBadge,
} from "./CoachingShared";

type CoachingInsightCardProps = {
  insight: CoachingInsight;
  compact?: boolean;
  onPress?: () => void;
};

export function CoachingInsightCard({
  insight,
  compact = false,
  onPress,
}: CoachingInsightCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CoachingPriorityBadge priority={insight.priority} />
          <CoachingCategoryChip category={insight.category} />
        </View>
        <CoachingImpactPill strokes={insight.impactStrokes} />
      </View>

      <Text style={styles.headline}>{insight.headline}</Text>

      {!compact ? (
        <>
          <Text style={styles.insight}>{insight.insight}</Text>
          <View style={styles.footer}>
            <Text style={styles.confidence}>
              Based on {insight.confidenceRounds} rounds · {insight.confidenceShots} shots
            </Text>
            <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
          </View>
        </>
      ) : (
        <View style={styles.compactFooter}>
          <Text numberOfLines={1} style={styles.recommendation}>
            {insight.recommendation}
          </Text>
          <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    width: "100%",
  },
  cardPressed: {
    opacity: 0.92,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  headline: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  insight: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.xxs,
  },
  compactFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  confidence: {
    ...typography.caption,
    color: colors.text.tertiary,
    flex: 1,
  },
  recommendation: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
});
