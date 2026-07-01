import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, controlSize, radii } from "../tokens";

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: CheckboxProps) {
  const isDisabled = disabled;
  const isActive = !isDisabled && (checked || indeterminate);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        checked: indeterminate ? "mixed" : checked,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isDisabled
          ? styles.disabled
          : isActive
            ? styles.active
            : styles.unchecked,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {isActive ? (
        indeterminate ? (
          <View style={styles.indeterminateMark} />
        ) : (
          <View style={styles.checkedMark} />
        )
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: controlSize.checkbox,
    height: controlSize.checkbox,
    borderRadius: radii.control,
    alignItems: "center",
    justifyContent: "center",
  },
  unchecked: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.strong,
    borderWidth: 1.5,
  },
  active: {
    backgroundColor: colors.action.primary,
    borderWidth: 0,
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
  checkedMark: {
    width: 10,
    height: 10,
    borderRadius: radii.xs,
    backgroundColor: colors.action.onPrimary,
  },
  indeterminateMark: {
    width: 10,
    height: 2,
    borderRadius: radii.full,
    backgroundColor: colors.action.onPrimary,
  },
});
