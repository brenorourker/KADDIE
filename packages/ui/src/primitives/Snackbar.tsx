import type { ReactNode } from "react";
import { useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Icon } from "./Icon";
import { Menu, MenuOption } from "./Menu";
import { useColors } from "../theme/Theme";
import {
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
  type ColorTokens,
} from "../tokens";

export type SnackbarVariant = "info" | "success" | "warning" | "error";

export type SnackbarMenuOption = {
  label: string;
  onPress?: () => void;
};

export type SnackbarProps = Omit<PressableProps, "children" | "style"> & {
  message: string;
  variant?: SnackbarVariant;
  icon?: ReactNode;
  menuOptions?: SnackbarMenuOption[];
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  style?: ViewStyle;
};

type VariantColors = {
  backgroundColor: string;
  foregroundColor: string;
};

function getVariantColors(
  colors: ColorTokens,
): Record<SnackbarVariant, VariantColors> {
  return {
    info: {
      backgroundColor: colors.feedback.infoBg,
      foregroundColor: colors.feedback.infoFg,
    },
    success: {
      backgroundColor: colors.feedback.successBg,
      foregroundColor: colors.feedback.successFg,
    },
    warning: {
      backgroundColor: colors.feedback.warningBg,
      foregroundColor: colors.feedback.warningFg,
    },
    error: {
      backgroundColor: colors.feedback.errorBg,
      foregroundColor: colors.feedback.error,
    },
  };
}

export function Snackbar({
  message,
  variant = "info",
  icon,
  menuOptions,
  menuOpen,
  onMenuOpenChange,
  disabled,
  style,
  onPress,
  ...pressableProps
}: SnackbarProps) {
  const colors = useColors();
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const palette = getVariantColors(colors)[variant];
  const hasMenu = Boolean(menuOptions?.length);
  const isMenuOpen = menuOpen ?? internalMenuOpen;

  const setMenuOpen = (nextOpen: boolean) => {
    if (menuOpen === undefined) {
      setInternalMenuOpen(nextOpen);
    }
    onMenuOpenChange?.(nextOpen);
  };

  const handleMenuToggle = () => {
    if (disabled) {
      return;
    }
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuOptionPress = (
    _option: MenuOption,
    index: number,
  ) => {
    menuOptions?.[index]?.onPress?.();
    setMenuOpen(false);
  };

  const iconNode =
    icon ?? (
      <Icon
        name="more"
        size={iconSize.lg}
        color={palette.foregroundColor}
      />
    );

  const iconButton = hasMenu ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      accessibilityState={{ expanded: isMenuOpen }}
      disabled={disabled}
      hitSlop={8}
      onPress={handleMenuToggle}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      {iconNode}
    </Pressable>
  ) : (
    iconNode
  );

  const messageNode = (
    <Text
      style={[styles.message, { color: palette.foregroundColor }]}
      numberOfLines={3}
    >
      {message}
    </Text>
  );

  const barContent = (
    <>
      {iconButton}
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [
            styles.messagePressable,
            pressed && !disabled ? styles.pressed : null,
          ]}
          {...pressableProps}
        >
          {messageNode}
        </Pressable>
      ) : (
        messageNode
      )}
    </>
  );

  const bar = (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.backgroundColor },
        isMenuOpen ? styles.containerOpen : null,
        style,
      ]}
    >
      {barContent}
    </View>
  );

  if (!hasMenu) {
    if (onPress) {
      return (
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [
            styles.container,
            { backgroundColor: palette.backgroundColor },
            pressed && !disabled ? styles.pressed : null,
            disabled ? styles.disabled : null,
            style,
          ]}
          {...pressableProps}
        >
          {iconNode}
          <Text
            style={[styles.message, { color: palette.foregroundColor }]}
            numberOfLines={3}
          >
            {message}
          </Text>
        </Pressable>
      );
    }

    return bar;
  }

  return (
    <View style={[styles.root, isMenuOpen ? styles.rootOpen : null]}>
      {bar}
      <Menu
        onOptionPress={handleMenuOptionPress}
        options={menuOptions!.map((option) => ({ label: option.label }))}
        style={styles.menu}
        visible={isMenuOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 340,
    position: "relative",
    zIndex: 1,
  },
  rootOpen: {
    zIndex: 20,
  },
  container: {
    minHeight: controlSize.snackbar,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    maxWidth: 340,
    width: "100%",
  },
  containerOpen: {
    zIndex: 1,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  messagePressable: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    ...typography.bodySmall,
    flex: 1,
    flexShrink: 1,
  },
  menu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: spacing.xxs,
    width: "100%",
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.6,
  },
});
