import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
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
import { useColors } from "../theme/Theme";
import {
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
  type ColorTokens,
} from "../tokens";
import { Icon } from "./Icon";
import { Switch } from "./Switch";

export type ListItemTrailing = "chevron" | "switch" | "none";

export type ListItemProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  supportingText?: string;
  avatarInitials?: string;
  trailing?: ListItemTrailing;
  switchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void;
  switchAccessibilityLabel?: string;
  style?: ViewStyle;
};

function ListItemAvatar({ initials }: { initials: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function ListItemContent({
  title,
  supportingText,
}: {
  title: string;
  supportingText?: string;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {supportingText ? (
        <Text style={styles.supportingText}>{supportingText}</Text>
      ) : null}
    </View>
  );
}

function ListItemTrailingAccessory({
  trailing,
  switchValue,
  onSwitchValueChange,
  switchAccessibilityLabel,
}: {
  trailing: ListItemTrailing;
  switchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void;
  switchAccessibilityLabel?: string;
}) {
  const colors = useColors();

  if (trailing === "none") {
    return null;
  }

  if (trailing === "switch") {
    return (
      <Switch
        accessibilityLabel={switchAccessibilityLabel}
        onValueChange={onSwitchValueChange}
        value={switchValue}
      />
    );
  }

  return (
    <Icon
      color={colors.text.primary}
      name="chevron-right"
      size={iconSize.md}
    />
  );
}

export function ListItem({
  title,
  supportingText,
  avatarInitials,
  trailing = "chevron",
  switchValue = false,
  onSwitchValueChange,
  switchAccessibilityLabel,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...pressableProps
}: ListItemProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isInteractive = Boolean(onPress) && trailing !== "switch";
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

  const content = (
    <>
      {avatarInitials ? <ListItemAvatar initials={avatarInitials} /> : null}
      <ListItemContent supportingText={supportingText} title={title} />
      <ListItemTrailingAccessory
        onSwitchValueChange={onSwitchValueChange}
        switchAccessibilityLabel={switchAccessibilityLabel ?? title}
        switchValue={switchValue}
        trailing={trailing}
      />
    </>
  );

  if (!isInteractive) {
    return <View style={[styles.row, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.row, styles.pressable, disabled && styles.disabled, style]}
      {...pressableProps}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.background, { backgroundColor }]}
      />
      {content}
    </Pressable>
  );
}

export type ListProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function List({ children, style }: ListProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={[styles.list, style]}>{children}</View>;
}

function createStyles(colors: ColorTokens) {
  return StyleSheet.create({
    list: {
      backgroundColor: colors.background.surface,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      backgroundColor: colors.background.surface,
    },
    pressable: {
      overflow: "hidden",
      position: "relative",
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      flex: 1,
      gap: spacing.xxxs,
      minWidth: 0,
    },
    title: {
      ...typography.titleDefault,
      color: colors.text.primary,
    },
    supportingText: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    avatar: {
      height: controlSize.listAvatar,
      minWidth: controlSize.listAvatar,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.full,
      backgroundColor: colors.feedback.successBg,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      ...typography.avatarInitials,
      color: colors.feedback.successFg,
    },
    disabled: {
      opacity: 0.6,
    },
  });
}
