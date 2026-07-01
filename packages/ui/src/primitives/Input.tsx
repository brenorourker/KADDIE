import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
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

export type InputProps = Omit<TextInputProps, "style" | "editable"> & {
  label: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  /** Shows focus border styling without requiring interaction (playground only). */
  previewFocused?: boolean;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  helperText,
  error,
  disabled = false,
  previewFocused = false,
  value,
  defaultValue,
  containerStyle,
  onFocus,
  onBlur,
  placeholder = "Enter value",
  onChangeText,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = value ?? internalValue;
  const hasValue = currentValue.length > 0;
  const isError = Boolean(error);
  const isFocused = previewFocused || focused;
  const message = error ?? helperText;

  const fieldBorderColor = disabled
    ? colors.border.default
    : isError
      ? colors.border.error
      : isFocused
        ? colors.border.focus
        : hasValue
          ? colors.border.strong
          : colors.border.default;

  const fieldBorderWidth = isFocused && !disabled && !isError ? 2 : 1;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          styles.label,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>

      <TextInput
        accessibilityLabel={label}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={
          disabled ? colors.text.disabled : colors.text.tertiary
        }
        value={value ?? internalValue}
        onChangeText={(text) => {
          if (value === undefined) {
            setInternalValue(text);
          }
          onChangeText?.(text);
        }}
        style={[
          styles.field,
          {
            borderColor: fieldBorderColor,
            borderWidth: fieldBorderWidth,
            backgroundColor: disabled
              ? colors.background.muted
              : colors.background.surface,
            color: disabled ? colors.text.disabled : colors.text.primary,
          },
        ]}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...textInputProps}
      />

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
    ...typography.bodyDefault,
    height: controlSize.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    outlineStyle: "none",
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
