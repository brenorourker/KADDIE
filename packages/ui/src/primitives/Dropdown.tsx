import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
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
import { ChevronDown, ChevronUp } from "./icons";
import { Menu } from "./Menu";

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  label: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  containerStyle?: ViewStyle;
};

export function Dropdown({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  helperText,
  error,
  disabled = false,
  open,
  onOpenChange,
  containerStyle,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const isOpen = open ?? internalOpen;
  const selectedValue = value ?? internalValue;
  const isError = Boolean(error);
  const message = error ?? helperText;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const hasValue = Boolean(selectedOption);
  const fieldBorderColor = disabled
    ? colors.border.default
    : isError
      ? colors.border.error
      : isOpen
        ? colors.border.focus
        : hasValue
          ? colors.border.strong
          : colors.border.default;
  const fieldBorderWidth = isOpen && !disabled && !isError ? 2 : 1;

  const setOpen = (nextOpen: boolean) => {
    if (disabled) {
      return;
    }
    if (open === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleSelect = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
    setOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isOpen }}
        disabled={disabled}
        onPress={() => setOpen(!isOpen)}
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
        <Text
          numberOfLines={1}
          style={[
            styles.fieldText,
            hasValue && !disabled
              ? styles.fieldTextValue
              : styles.fieldTextPlaceholder,
            disabled && styles.fieldTextDisabled,
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        {isOpen ? (
          <ChevronUp
            color={disabled ? colors.text.disabled : colors.text.primary}
          />
        ) : (
          <ChevronDown
            color={disabled ? colors.text.disabled : colors.text.primary}
          />
        )}
      </Pressable>

      {isOpen && !disabled ? (
        <Menu
          onOptionPress={(option) => handleSelect(option.value!)}
          options={options}
          selectedValue={selectedValue}
          showSelectedCheck
        />
      ) : null}

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
    zIndex: 1,
  },
  label: {
    ...typography.labelDefault,
    color: colors.text.primary,
  },
  labelDisabled: {
    color: colors.text.disabled,
  },
  field: {
    minHeight: controlSize.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  fieldText: {
    ...typography.bodyDefault,
    flex: 1,
  },
  fieldTextValue: {
    color: colors.text.primary,
  },
  fieldTextPlaceholder: {
    color: colors.text.tertiary,
  },
  fieldTextDisabled: {
    color: colors.text.disabled,
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
