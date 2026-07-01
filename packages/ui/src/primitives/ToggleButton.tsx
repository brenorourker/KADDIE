import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import type { IconName } from "../assets/icons/registry";
import {
  colors,
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
} from "../tokens";
import { Icon } from "./Icon";

export type ToggleButtonVariant = "pill" | "filled";

export type ToggleButtonOption = {
  label: string;
  icon?: IconName;
};

export type ToggleButtonProps = {
  options: ToggleButtonOption[];
  value: number;
  onValueChange: (index: number) => void;
  variant?: ToggleButtonVariant;
  style?: ViewStyle;
};

type SegmentProps = {
  label: string;
  icon?: IconName;
  selected: boolean;
  variant: ToggleButtonVariant;
  showDivider: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

const pillPadding = spacing.xxs;

function ToggleSegment({
  label,
  icon,
  selected,
  variant,
  showDivider,
  onPress,
  accessibilityLabel,
}: SegmentProps) {
  const isPill = variant === "pill";

  const textColor = isPill
    ? selected
      ? colors.text.primary
      : colors.text.secondary
    : selected
      ? colors.action.onPrimary
      : colors.text.primary;

  const iconColor = textColor;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.segment,
        isPill ? styles.segmentPill : styles.segmentFilled,
        !isPill && selected && styles.segmentFilledSelected,
        !isPill && showDivider && styles.segmentFilledDivider,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <Icon name={icon} size={iconSize.sm} color={iconColor} /> : null}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function ToggleButton({
  options,
  value,
  onValueChange,
  variant = "pill",
  style,
}: ToggleButtonProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const animatedIndex = useRef(new Animated.Value(value)).current;
  const hasMounted = useRef(false);
  const previousSegmentCount = useRef(options.length);
  const previousSegmentWidth = useRef(0);

  if (options.length < 2 || options.length > 4) {
    return null;
  }

  const isPill = variant === "pill";
  const innerWidth = Math.max(0, trackWidth - pillPadding * 2);
  const segmentWidth = innerWidth / options.length;

  useEffect(() => {
    const segmentCountChanged = previousSegmentCount.current !== options.length;
    const segmentWidthChanged = previousSegmentWidth.current !== segmentWidth;
    previousSegmentCount.current = options.length;
    previousSegmentWidth.current = segmentWidth;

    if (segmentWidth <= 0) {
      return;
    }

    if (segmentCountChanged || segmentWidthChanged) {
      animatedIndex.setValue(value);
      return;
    }

    if (!hasMounted.current) {
      hasMounted.current = true;
      animatedIndex.setValue(value);
      return;
    }

    Animated.timing(animatedIndex, {
      toValue: value,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animatedIndex, options.length, segmentWidth, value]);

  const indicatorTranslateX = animatedIndex.interpolate({
    inputRange: options.map((_, index) => index),
    outputRange: options.map((_, index) => index * segmentWidth),
  });

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(event) => {
        setTrackWidth(event.nativeEvent.layout.width);
      }}
      style={[
        styles.container,
        isPill ? styles.containerPill : styles.containerFilled,
        style,
      ]}
    >
      {isPill && segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pillIndicator,
            {
              width: segmentWidth,
              transform: [{ translateX: indicatorTranslateX }],
            },
          ]}
        />
      ) : null}

      {options.map((option, index) => {
        const selected = value === index;
        const showDivider =
          !isPill &&
          index < options.length - 1 &&
          !selected &&
          value !== index + 1;

        return (
          <ToggleSegment
            key={`${option.label}-${index}`}
            accessibilityLabel={option.label}
            icon={option.icon}
            label={option.label}
            onPress={() => onValueChange(index)}
            selected={selected}
            showDivider={showDivider}
            variant={variant}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: controlSize.md,
  },
  containerPill: {
    backgroundColor: colors.background.muted,
    borderRadius: radii.full,
    padding: pillPadding,
    position: "relative",
    overflow: "hidden",
  },
  containerFilled: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderWidth: 1,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  pillIndicator: {
    position: "absolute",
    top: pillPadding,
    left: pillPadding,
    height: controlSize.sm,
    borderRadius: radii.full,
    backgroundColor: colors.background.surface,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 0,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxs,
    minWidth: 0,
    zIndex: 1,
  },
  segmentPill: {
    height: controlSize.sm,
    borderRadius: radii.full,
  },
  segmentFilled: {
    height: "100%",
  },
  segmentFilledSelected: {
    backgroundColor: colors.action.primary,
  },
  segmentFilledDivider: {
    borderRightColor: colors.border.default,
    borderRightWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.labelDefault,
    letterSpacing: 0.028,
  },
});
