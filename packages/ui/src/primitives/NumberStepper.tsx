import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  controlSize,
  radii,
  spacing,
  typography,
} from "../tokens";
import { Icon } from "./Icon";

export type NumberStepperProps = {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  /** Shows focus border styling without requiring interaction (playground only). */
  previewFocused?: boolean;
  containerStyle?: ViewStyle;
};

export function NumberStepper({
  label,
  value,
  defaultValue = 1,
  onValueChange,
  min = 1,
  max,
  step = 1,
  helperText,
  error,
  disabled = false,
  previewFocused = false,
  containerStyle,
}: NumberStepperProps) {
  const [focused, setFocused] = useState(false);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const isError = Boolean(error);
  const isFocused = previewFocused || focused;
  const hasChangedValue = currentValue !== defaultValue;
  const message = error ?? helperText;

  const fieldBorderColor = disabled
    ? colors.border.default
    : isError
      ? colors.border.error
      : isFocused
        ? colors.border.focus
        : hasChangedValue
          ? colors.border.strong
          : colors.border.default;

  const fieldBorderWidth = isFocused && !disabled && !isError ? 2 : 1;

  const valueColor = disabled
    ? colors.text.disabled
    : isError || isFocused || hasChangedValue
      ? colors.text.primary
      : colors.text.tertiary;

  const iconColor = disabled ? colors.text.disabled : colors.text.primary;
  const canDecrement = !disabled && currentValue - step >= min;
  const canIncrement =
    !disabled && (max === undefined || currentValue + step <= max);

  const updateValue = (nextValue: number) => {
    const clampedValue = Math.min(
      max ?? nextValue,
      Math.max(min, nextValue)
    );

    if (value === undefined) {
      setInternalValue(clampedValue);
    }
    onValueChange?.(clampedValue);
  };

  const handleStep = (direction: -1 | 1) => {
    if (disabled) {
      return;
    }

    setFocused(true);
    const nextValue = currentValue + direction * step;
    updateValue(nextValue);

    if (editingText !== null) {
      const clampedValue = Math.min(
        max ?? nextValue,
        Math.max(min, nextValue),
      );
      setEditingText(String(clampedValue));
    }
  };

  const handleValueFocus = () => {
    if (disabled) {
      return;
    }

    setFocused(true);
    setEditingText(String(currentValue));
  };

  const handleValueChangeText = (text: string) => {
    if (text === "") {
      setEditingText("");
      return;
    }

    if (/^\d+$/.test(text)) {
      setEditingText(text);
    }
  };

  const handleValueBlur = () => {
    setFocused(false);

    if (editingText === null) {
      return;
    }

    if (editingText === "") {
      updateValue(min);
      setEditingText(null);
      return;
    }

    const parsedValue = Number.parseInt(editingText, 10);
    if (Number.isNaN(parsedValue)) {
      updateValue(min);
    } else {
      updateValue(parsedValue);
    }

    setEditingText(null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>

      <View
        accessibilityLabel={label}
        accessibilityRole="adjustable"
        accessibilityState={{ disabled }}
        accessibilityValue={{
          min,
          max,
          now: currentValue,
          text: String(currentValue),
        }}
        style={[
          styles.field,
          {
            borderColor: fieldBorderColor,
            borderWidth: fieldBorderWidth,
            backgroundColor: disabled
              ? colors.background.muted
              : colors.background.surface,
          },
        ]}
      >
        <Pressable
          accessibilityLabel="Decrease"
          accessibilityRole="button"
          disabled={!canDecrement}
          hitSlop={4}
          onPress={() => handleStep(-1)}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && canDecrement && styles.stepButtonPressed,
          ]}
        >
          <Icon
            name="minus"
            size={24}
            color={canDecrement ? iconColor : colors.text.disabled}
          />
        </Pressable>

        <TextInput
          accessibilityLabel={`${label} value`}
          editable={!disabled}
          keyboardType="number-pad"
          selectTextOnFocus
          style={[styles.valueInput, { color: valueColor }]}
          value={editingText ?? String(currentValue)}
          onBlur={handleValueBlur}
          onChangeText={handleValueChangeText}
          onFocus={handleValueFocus}
        />

        <Pressable
          accessibilityLabel="Increase"
          accessibilityRole="button"
          disabled={!canIncrement}
          hitSlop={4}
          onPress={() => handleStep(1)}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && canIncrement && styles.stepButtonPressed,
          ]}
        >
          <Icon
            name="plus"
            size={24}
            color={canIncrement ? iconColor : colors.text.disabled}
          />
        </Pressable>
      </View>

      {message ? (
        <Text
          style={[
            styles.message,
            isError ? styles.messageError : styles.messageHelper,
            disabled && styles.messageDisabled,
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxs,
    width: "100%",
    maxWidth: 320,
  },
  label: {
    ...typography.labelDefault,
    color: colors.text.primary,
  },
  labelDisabled: {
    color: colors.text.disabled,
  },
  field: {
    height: controlSize.md,
    borderRadius: radii.sm,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  stepButton: {
    width: controlSize.md,
    height: controlSize.md,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonPressed: {
    backgroundColor: colors.background.muted,
  },
  valueInput: {
    ...typography.bodyDefault,
    flex: 1,
    minWidth: 0,
    outlineStyle: "none",
    paddingHorizontal: spacing.xs,
    paddingVertical: 0,
    textAlign: "center",
  },
  message: {
    ...typography.caption,
  },
  messageHelper: {
    color: colors.text.tertiary,
  },
  messageError: {
    color: colors.feedback.error,
  },
  messageDisabled: {
    color: colors.text.disabled,
  },
});
