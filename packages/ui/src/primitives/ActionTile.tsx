import type { ReactNode } from "react";
import { useRef } from "react";
import {
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
import { Icon } from "./Icon";

export type ActionTileLayout = "vertical" | "horizontal";

export type ActionTileProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  subtitle: string;
  layout?: ActionTileLayout;
  icon?: ReactNode;
  showChevron?: boolean;
  /** Expands to fill available row/column width (e.g. 2-column grids). */
  fillWidth?: boolean;
  style?: ViewStyle;
};

function ActionTileIcon({ icon }: { icon?: ReactNode }) {
  return (
    <View style={styles.iconContainer}>
      {icon ?? <Icon name="plus" size={iconSize.md} color={colors.text.primary} />}
    </View>
  );
}

export function ActionTile({
  title,
  subtitle,
  layout = "vertical",
  icon,
  showChevron = layout === "horizontal",
  fillWidth = false,
  disabled,
  style,
  onPressIn,
  onPressOut,
  ...pressableProps
}: ActionTileProps) {
  const isHorizontal = layout === "horizontal";
  const pressProgress = useRef(new Animated.Value(0)).current;

  const animatePress = (toValue: number) => {
    Animated.timing(pressProgress, {
      toValue,
      duration: toValue === 1 ? 150 : 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const handlePressIn: PressableProps["onPressIn"] = (event) => {
    if (!disabled) {
      animatePress(1);
    }
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps["onPressOut"] = (event) => {
    if (!disabled) {
      animatePress(0);
    }
    onPressOut?.(event);
  };

  const backgroundColor = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background.surface, colors.background.muted],
  });

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        isHorizontal
          ? styles.horizontal
          : fillWidth
            ? styles.verticalFill
            : styles.vertical,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...pressableProps}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.background, { backgroundColor }]}
      />

      <View
        style={[
          styles.content,
          isHorizontal ? styles.contentHorizontal : styles.contentVertical,
        ]}
      >
        <ActionTileIcon icon={icon} />

        <View
          style={[
            styles.textBlock,
            isHorizontal ? styles.textBlockHorizontal : styles.textBlockVertical,
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {isHorizontal && showChevron ? (
          <Icon
            name="chevron-right"
            size={iconSize.md}
            color={colors.text.primary}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: "hidden",
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  contentVertical: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  contentHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  vertical: {
    width: "100%",
    maxWidth: controlSize.actionTileVerticalWidth,
  },
  verticalFill: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
  },
  horizontal: {
    width: "100%",
    maxWidth: controlSize.actionTileHorizontalWidth,
  },
  iconContainer: {
    width: controlSize.actionTileIcon,
    height: controlSize.actionTileIcon,
    borderRadius: radii.sm,
    backgroundColor: colors.background.muted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  textBlock: {
    alignItems: "flex-start",
  },
  textBlockVertical: {
    gap: spacing.xxxs,
    width: "100%",
  },
  textBlockHorizontal: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  title: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  disabled: {
    opacity: 0.6,
  },
});
