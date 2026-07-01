import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import {
  colors,
  controlSize,
  radii,
  spacing,
  typography,
} from "../tokens";

export type ChipVariant = "filled" | "outlined";

export type ChipProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: ChipVariant;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

type ChipColors = {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  textColor: string;
};

function getChipColors(
  variant: ChipVariant,
  selected: boolean,
  disabled: boolean,
): ChipColors {
  if (disabled) {
    if (variant === "outlined") {
      return {
        backgroundColor: colors.background.surface,
        borderColor: colors.border.default,
        borderWidth: 1,
        textColor: colors.text.disabled,
      };
    }
    return {
      backgroundColor: colors.background.muted,
      textColor: colors.text.disabled,
    };
  }

  if (selected) {
    return {
      backgroundColor: colors.action.primary,
      textColor: colors.action.onPrimary,
    };
  }

  if (variant === "outlined") {
    return {
      backgroundColor: colors.background.surface,
      borderColor: colors.border.strong,
      borderWidth: 1,
      textColor: colors.text.primary,
    };
  }

  return {
    backgroundColor: colors.background.muted,
    textColor: colors.text.primary,
  };
}

export function Chip({
  label,
  variant = "filled",
  selected = false,
  disabled = false,
  style,
  ...pressableProps
}: ChipProps) {
  const chipColors = getChipColors(variant, selected, disabled);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: chipColors.backgroundColor,
          borderColor: chipColors.borderColor,
          borderWidth: chipColors.borderWidth ?? 0,
        },
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...pressableProps}
    >
      <Text style={[styles.label, { color: chipColors.textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: controlSize.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.chipLabel,
  },
});
