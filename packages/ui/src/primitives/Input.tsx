import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
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

export type InputSize = "md" | "lg";

export type InputProps = Omit<TextInputProps, "style" | "editable"> & {
  label: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  size?: InputSize;
  /** Shows focus border styling without requiring interaction (playground only). */
  previewFocused?: boolean;
  trailingActionLabel?: string;
  onTrailingActionPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
};

const sizeConfig = {
  md: {
    containerHeight: controlSize.md,
  },
  lg: {
    containerHeight: controlSize.lg,
  },
} as const;

export function Input({
  label,
  helperText,
  error,
  disabled = false,
  size = "md",
  previewFocused = false,
  trailingActionLabel,
  onTrailingActionPress,
  value,
  defaultValue,
  containerStyle,
  labelStyle,
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
  const sizeStyles = sizeConfig[size];
  const textLineHeight = typography.bodyDefault.lineHeight;
  const fieldTextPaddingVertical = Math.max(
    0,
    (sizeStyles.containerHeight - fieldBorderWidth * 2 - textLineHeight) / 2,
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          styles.label,
          labelStyle,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.fieldContainer,
          {
            borderColor: fieldBorderColor,
            borderWidth: fieldBorderWidth,
            height: sizeStyles.containerHeight,
            backgroundColor: disabled
              ? colors.background.muted
              : colors.background.surface,
          },
        ]}
      >
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
            trailingActionLabel ? styles.fieldWithTrailing : null,
            {
              color: disabled ? colors.text.disabled : colors.text.primary,
              lineHeight: textLineHeight,
              paddingVertical: fieldTextPaddingVertical,
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

        {trailingActionLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={trailingActionLabel}
            disabled={disabled}
            hitSlop={8}
            onPress={onTrailingActionPress}
            style={styles.trailingAction}
          >
            <Text
              style={[
                styles.trailingActionLabel,
                disabled && styles.trailingActionLabelDisabled,
              ]}
            >
              {trailingActionLabel}
            </Text>
          </Pressable>
        ) : null}
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
    color: colors.text.secondary,
  },
  labelDisabled: {
    color: colors.text.disabled,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  field: {
    ...typography.bodyDefault,
    flex: 1,
    outlineStyle: "none",
    paddingHorizontal: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  fieldWithTrailing: {
    paddingRight: 0,
  },
  trailingAction: {
    paddingVertical: spacing.xs,
  },
  trailingActionLabel: {
    ...typography.bodyDefault,
    color: colors.text.tertiary,
  },
  trailingActionLabelDisabled: {
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
