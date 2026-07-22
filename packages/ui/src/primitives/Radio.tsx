import { useMemo } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "../theme/Theme";
import { controlSize, radii, type ColorTokens } from "../tokens";

export type RadioProps = {
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function Radio({
  selected = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: RadioProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDisabled = disabled;
  const isSelected = selected && !isDisabled;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isDisabled
          ? styles.disabled
          : isSelected
            ? styles.selected
            : styles.unselected,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {isSelected ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

function createStyles(colors: ColorTokens) {
  return StyleSheet.create({
    base: {
      width: controlSize.radio,
      height: controlSize.radio,
      borderRadius: radii.full,
      alignItems: "center",
      justifyContent: "center",
    },
    unselected: {
      backgroundColor: colors.background.surface,
      borderColor: colors.border.strong,
      borderWidth: 1.5,
    },
    selected: {
      backgroundColor: colors.background.surface,
      borderColor: colors.action.primary,
      borderWidth: 2,
    },
    disabled: {
      backgroundColor: colors.background.muted,
      borderColor: colors.border.default,
      borderWidth: 1,
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.85,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: radii.full,
      backgroundColor: colors.action.primary,
    },
  });
}
