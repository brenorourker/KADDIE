import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  colors,
  controlSize,
  radii,
  spacing,
  typography,
} from "../tokens";

export type BadgeType = "dot" | "count" | "status";
export type BadgeColor = "brand" | "error" | "warning" | "info";

export type BadgeProps = {
  type?: BadgeType;
  color?: BadgeColor;
  count?: number | string;
  label?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

type BadgeColors = {
  backgroundColor: string;
  textColor?: string;
};

const STATUS_DEFAULT_LABELS: Record<BadgeColor, string> = {
  brand: "NEW",
  error: "OVERDUE",
  warning: "PENDING",
  info: "INFO",
};

function getBadgeColors(type: BadgeType, color: BadgeColor): BadgeColors {
  if (type === "dot") {
    return {
      backgroundColor:
        color === "error" ? colors.action.destructive : colors.action.primary,
    };
  }

  if (type === "count") {
    if (color === "error") {
      return {
        backgroundColor: colors.action.destructive,
        textColor: colors.action.onDestructive,
      };
    }

    return {
      backgroundColor: colors.action.primary,
      textColor: colors.action.onPrimary,
    };
  }

  switch (color) {
    case "error":
      return {
        backgroundColor: colors.feedback.errorBg,
        textColor: colors.feedback.error,
      };
    case "warning":
      return {
        backgroundColor: colors.feedback.warningBg,
        textColor: colors.feedback.warningFg,
      };
    case "info":
      return {
        backgroundColor: colors.feedback.infoBg,
        textColor: colors.feedback.infoFg,
      };
    case "brand":
    default:
      return {
        backgroundColor: colors.feedback.successBg,
        textColor: colors.feedback.successFg,
      };
  }
}

export function Badge({
  type = "dot",
  color = "brand",
  count = 3,
  label,
  style,
  accessibilityLabel,
}: BadgeProps) {
  const badgeColors = getBadgeColors(type, color);

  if (type === "dot") {
    return (
      <View
        accessibilityLabel={accessibilityLabel ?? `${color} indicator`}
        style={[styles.dot, { backgroundColor: badgeColors.backgroundColor }, style]}
      />
    );
  }

  const text =
    type === "count"
      ? String(count)
      : (label ?? STATUS_DEFAULT_LABELS[color]);

  return (
    <View
      accessibilityLabel={
        accessibilityLabel ??
        (type === "count" ? `${count} notifications` : text)
      }
      style={[
        type === "count" ? styles.count : styles.status,
        { backgroundColor: badgeColors.backgroundColor },
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          type === "count" ? styles.countLabel : styles.label,
          { color: badgeColors.textColor },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: controlSize.badgeDot,
    height: controlSize.badgeDot,
    borderRadius: radii.full,
  },
  count: {
    minWidth: controlSize.badgeCount,
    height: controlSize.badgeCount,
    paddingHorizontal: spacing.xxs,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxxs,
    borderRadius: radii.control,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...typography.badgeLabel,
  },
  countLabel: {
    ...typography.badgeLabel,
    height: controlSize.badgeCount,
    lineHeight: controlSize.badgeCount,
    textAlign: "center",
    includeFontPadding: false,
  },
});
