import { StyleSheet, Text, View } from "react-native";
import { Badge, colors, spacing, typography } from "@kaddie/ui";
import type { CoachingCategory, CoachingPriority } from "../coachingTypes";
import { categoryLabels } from "../coachingMockData";

type CoachingSectionHeaderProps = {
  label: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function CoachingSectionHeader({
  label,
  actionLabel,
  onActionPress,
}: CoachingSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {actionLabel && onActionPress ? (
        <Text accessibilityRole="button" onPress={onActionPress} style={styles.action}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

type CoachingCategoryChipProps = {
  category: CoachingCategory;
};

const categoryColors: Record<CoachingCategory, { bg: string; fg: string }> = {
  driving: { bg: colors.feedback.infoBg, fg: colors.feedback.infoFg },
  approach: { bg: colors.feedback.successBg, fg: colors.feedback.successFg },
  "short-game": { bg: colors.background.accentSubtle, fg: "#8B5C32" },
  putting: { bg: "#F3E8FF", fg: "#7C3AED" },
  "course-management": { bg: colors.feedback.warningBg, fg: colors.feedback.warningFg },
};

export function CoachingCategoryChip({ category }: CoachingCategoryChipProps) {
  const palette = categoryColors[category];
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      <Text style={[styles.chipText, { color: palette.fg }]}>
        {categoryLabels[category]}
      </Text>
    </View>
  );
}

type CoachingPriorityBadgeProps = {
  priority: CoachingPriority;
};

const priorityConfig: Record<
  CoachingPriority,
  { label: string; color: "error" | "warning" | "info" }
> = {
  high: { label: "HIGH IMPACT", color: "error" },
  medium: { label: "MEDIUM", color: "warning" },
  low: { label: "LOW", color: "info" },
};

export function CoachingPriorityBadge({ priority }: CoachingPriorityBadgeProps) {
  const config = priorityConfig[priority];
  return <Badge color={config.color} label={config.label} type="status" />;
}

type CoachingImpactPillProps = {
  strokes: number;
};

export function CoachingImpactPill({ strokes }: CoachingImpactPillProps) {
  return (
    <View style={styles.impactPill}>
      <Text style={styles.impactValue}>~{strokes.toFixed(1)}</Text>
      <Text style={styles.impactLabel}>strokes/round</Text>
    </View>
  );
}

type CoachingStatBulletProps = {
  items: string[];
};

export function CoachingStatBullet({ items }: CoachingStatBulletProps) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

type CoachingProgressBarProps = {
  progress: number;
  trend?: "improving" | "stable" | "declining";
};

const trendColors = {
  improving: colors.feedback.successFg,
  stable: colors.text.tertiary,
  declining: colors.feedback.error,
};

export function CoachingProgressBar({ progress, trend = "stable" }: CoachingProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: trendColors[trend],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  action: {
    ...typography.caption,
    color: colors.feedback.successFg,
    textTransform: "uppercase",
  },
  chip: {
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxxs,
  },
  chipText: {
    ...typography.badgeLabel,
  },
  impactPill: {
    alignItems: "center",
    backgroundColor: colors.feedback.errorBg,
    borderRadius: 8,
    minWidth: 72,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  impactValue: {
    ...typography.titleDefault,
    color: colors.feedback.error,
  },
  impactLabel: {
    ...typography.caption,
    color: colors.feedback.error,
  },
  bulletList: {
    gap: spacing.xs,
  },
  bulletRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  bulletDot: {
    backgroundColor: colors.action.primary,
    borderRadius: 3,
    height: 6,
    marginTop: 6,
    width: 6,
  },
  bulletText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  progressTrack: {
    backgroundColor: colors.background.muted,
    borderRadius: 3,
    height: 6,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    borderRadius: 3,
    height: "100%",
  },
});
