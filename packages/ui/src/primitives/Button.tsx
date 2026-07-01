import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
} from "../tokens";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconOnly?: boolean;
  style?: ViewStyle;
};

const sizeConfig = {
  sm: {
    height: controlSize.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    gap: spacing.xxs,
    label: typography.buttonSm,
    icon: iconSize.sm,
    iconOnlyWidth: 40,
  },
  md: {
    height: controlSize.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
    label: typography.buttonMd,
    icon: iconSize.md,
    iconOnlyWidth: 52,
  },
  lg: {
    height: controlSize.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    gap: spacing.sm,
    label: typography.buttonLg,
    icon: iconSize.lg,
    iconOnlyWidth: 64,
  },
} as const;

type VariantColors = {
  background: string;
  backgroundPressed: string;
  backgroundDisabled: string;
  text: string;
  textDisabled: string;
  borderColor?: string;
  borderWidth?: number;
  borderColorDisabled?: string;
};

const variantColors: Record<ButtonVariant, VariantColors> = {
  primary: {
    background: colors.action.primary,
    backgroundPressed: colors.action.primaryPressed,
    backgroundDisabled: colors.action.disabled,
    text: colors.action.onPrimary,
    textDisabled: colors.action.onDisabled,
    borderWidth: 0,
  },
  secondary: {
    background: colors.background.surface,
    backgroundPressed: colors.background.muted,
    backgroundDisabled: colors.background.muted,
    text: colors.action.onSecondary,
    textDisabled: colors.text.tertiary,
    borderColor: colors.border.strong,
    borderWidth: 1,
    borderColorDisabled: "transparent",
  },
  ghost: {
    background: "transparent",
    backgroundPressed: colors.action.ghostPressed,
    backgroundDisabled: colors.action.disabled,
    text: colors.action.onGhost,
    textDisabled: colors.action.onDisabled,
    borderWidth: 0,
  },
  destructive: {
    background: colors.action.destructive,
    backgroundPressed: colors.action.destructivePressed,
    backgroundDisabled: colors.action.disabled,
    text: colors.action.onDestructive,
    textDisabled: colors.action.onDisabled,
    borderWidth: 0,
  },
};

export function Button({
  label,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  iconOnly = false,
  style,
  onPressIn,
  onPressOut,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const sizeStyles = sizeConfig[size];
  const palette = variantColors[variant];
  const pressProgress = useRef(new Animated.Value(0)).current;

  const backgroundColor = isDisabled
    ? palette.backgroundDisabled
    : palette.background;
  const textColor = isDisabled ? palette.textDisabled : palette.text;
  const borderColor = isDisabled
    ? palette.borderColorDisabled ?? "transparent"
    : palette.borderColor ?? "transparent";
  const borderWidth = isDisabled
    ? palette.borderColorDisabled
      ? 0
      : palette.borderWidth ?? 0
    : palette.borderWidth ?? 0;

  useEffect(() => {
    if (isDisabled) {
      pressProgress.setValue(0);
    }
  }, [isDisabled, pressProgress]);

  const animatePress = (toValue: number) => {
    if (isDisabled) {
      return;
    }

    Animated.timing(pressProgress, {
      toValue,
      duration: toValue === 1 ? 150 : 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const handlePressIn: PressableProps["onPressIn"] = (event) => {
    animatePress(1);
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps["onPressOut"] = (event) => {
    animatePress(0);
    onPressOut?.(event);
  };

  const isGhost = variant === "ghost";

  const animatedBackgroundColor = isDisabled
    ? backgroundColor
    : isGhost
      ? palette.backgroundPressed
      : pressProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [palette.background, palette.backgroundPressed],
        });

  const animatedBackgroundOpacity = isDisabled || !isGhost
    ? 1
    : pressProgress;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        {
          height: sizeStyles.height,
          minWidth: iconOnly ? sizeStyles.iconOnlyWidth : undefined,
          paddingHorizontal: iconOnly ? 0 : sizeStyles.paddingHorizontal,
          borderRadius: sizeStyles.borderRadius,
          gap: sizeStyles.gap,
          borderColor,
          borderWidth,
        },
        style,
      ]}
      {...pressableProps}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.background,
          {
            backgroundColor: animatedBackgroundColor,
            borderRadius: sizeStyles.borderRadius,
            opacity: animatedBackgroundOpacity,
          },
        ]}
      />

      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leadingIcon ? (
            <View style={{ width: sizeStyles.icon, height: sizeStyles.icon }}>
              {leadingIcon}
            </View>
          ) : null}
          {!iconOnly ? (
            <Text style={[sizeStyles.label, { color: textColor }]}>{label}</Text>
          ) : null}
          {trailingIcon ? (
            <View style={{ width: sizeStyles.icon, height: sizeStyles.icon }}>
              {trailingIcon}
            </View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
