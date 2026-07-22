import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useColors } from "../theme/Theme";
import {
  controlSize,
  radii,
  spacing,
  typography,
  type ColorTokens,
} from "../tokens";
import { CheckIcon } from "./icons";

export type MenuOption = {
  label: string;
  value?: string;
};

export type MenuPlacement = "inline" | "overlay";

const DEFAULT_VISIBLE_OPTION_COUNT = 4;

export function getMenuMaxHeight(visibleOptionCount: number) {
  return visibleOptionCount * controlSize.md + spacing.xxs * 2;
}

export type MenuProps = {
  options: MenuOption[];
  onOptionPress?: (option: MenuOption, index: number) => void;
  selectedValue?: string;
  showSelectedCheck?: boolean;
  visible?: boolean;
  placement?: MenuPlacement;
  style?: ViewStyle;
  maxHeight?: number;
};

export function Menu({
  options,
  onOptionPress,
  selectedValue,
  showSelectedCheck = false,
  visible = true,
  placement = "inline",
  style,
  maxHeight = getMenuMaxHeight(DEFAULT_VISIBLE_OPTION_COUNT),
}: MenuProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      progress.setValue(visible ? 1 : 0);
      return;
    }

    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, visible]);

  const animatedStyle = {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-4, 0],
        }),
      },
    ],
  };

  if (!visible && !hasMounted.current) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.menu,
        placement === "overlay" ? styles.menuOverlay : null,
        { maxHeight },
        animatedStyle,
        style,
      ]}
    >
      <ScrollView
        nestedScrollEnabled
        style={{ maxHeight }}
        keyboardShouldPersistTaps="handled"
      >
        {options.map((option, index) => {
          const isSelected =
            showSelectedCheck &&
            option.value !== undefined &&
            option.value === selectedValue;

          return (
            <Pressable
              key={`${option.label}-${option.value ?? index}`}
              accessibilityRole="menuitem"
              onPress={() => onOptionPress?.(option, index)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              {isSelected ? <CheckIcon /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

function createStyles(colors: ColorTokens) {
  return StyleSheet.create({
    menu: {
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default,
      borderWidth: 1,
      borderRadius: radii.sm,
      overflow: "hidden",
      paddingVertical: spacing.xxs,
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    menuOverlay: {
      left: 0,
      marginTop: spacing.xxs,
      position: "absolute",
      right: 0,
      top: "100%",
      width: "100%",
      zIndex: 100,
      elevation: 8,
    },
    option: {
      minHeight: controlSize.md,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    optionPressed: {
      backgroundColor: colors.background.muted,
    },
    optionText: {
      ...typography.bodyDefault,
      color: colors.text.primary,
      flex: 1,
    },
  });
}
