import type { ReactNode } from "react";
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
import {
  colors,
  iconSize,
  radii,
  spacing,
  typography,
} from "../tokens";
import { Icon } from "./Icon";

export type AccordionProps = {
  title: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Accordion({
  title,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  children,
  placeholder = "Drop components here",
  disabled = false,
  style,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const isExpanded = expanded ?? internalExpanded;
  const progress = useRef(
    new Animated.Value((expanded ?? defaultExpanded) ? 1 : 0),
  ).current;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      progress.setValue(isExpanded ? 1 : 0);
      return;
    }

    Animated.timing(progress, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isExpanded, progress]);

  const toggle = () => {
    if (disabled) return;
    const nextExpanded = !isExpanded;
    if (expanded === undefined) {
      setInternalExpanded(nextExpanded);
    }
    onExpandedChange?.(nextExpanded);
  };

  const animatedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(contentHeight, 0)],
  });

  const contentOpacity = progress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.6, 1],
  });

  const chevronRotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const content =
    children ?? <Text style={styles.placeholder}>{placeholder}</Text>;

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isExpanded }}
        accessibilityLabel={title}
        disabled={disabled}
        onPress={toggle}
        style={({ pressed }) => [
          styles.header,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Icon
            color={colors.text.primary}
            name="chevron-down"
            size={iconSize.lg}
          />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[
          styles.contentAnimated,
          contentHeight > 0
            ? {
                height: animatedHeight,
                opacity: contentOpacity,
              }
            : isExpanded
              ? styles.contentVisible
              : styles.contentHidden,
        ]}
      >
        <View
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight !== contentHeight) {
              setContentHeight(nextHeight);
            }
          }}
          style={styles.content}
        >
          {content}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderWidth: 1,
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.bodyDefault,
    flex: 1,
    color: colors.text.primary,
  },
  contentAnimated: {
    overflow: "hidden",
  },
  contentVisible: {
    opacity: 1,
  },
  contentHidden: {
    height: 0,
    opacity: 0,
  },
  content: {
    borderTopColor: colors.border.default,
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  placeholder: {
    ...typography.bodySmall,
    color: colors.text.disabled,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.85,
  },
});
