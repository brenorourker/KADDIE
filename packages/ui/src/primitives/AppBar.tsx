import type { ReactNode } from "react";
import { useState } from "react";
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
  iconSize,
  spacing,
  typography,
} from "../tokens";
import { Icon } from "./Icon";
import { Menu, MenuOption } from "./Menu";

export type AppBarVariant = "default" | "with-action" | "centered";

export type AppBarMenuOption = {
  label: string;
  onPress?: () => void;
};

export type AppBarProps = {
  title: string;
  variant?: AppBarVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  secondTrailingIcon?: ReactNode;
  menuOptions?: AppBarMenuOption[];
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  onLeadingPress?: () => void;
  onTrailingPress?: () => void;
  onSecondTrailingPress?: () => void;
  leadingAccessibilityLabel?: string;
  trailingAccessibilityLabel?: string;
  secondTrailingAccessibilityLabel?: string;
  style?: ViewStyle;
};

function AppBarIconSlot({
  children,
  onPress,
  accessibilityLabel,
  expanded,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  expanded?: boolean;
}) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded }}
        hitSlop={8}
        onPress={onPress}
        style={styles.iconSlot}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={styles.iconSlot}>{children}</View>;
}

export function AppBar({
  title,
  variant = "default",
  leadingIcon,
  trailingIcon,
  secondTrailingIcon,
  menuOptions,
  menuOpen,
  onMenuOpenChange,
  onLeadingPress,
  onTrailingPress,
  onSecondTrailingPress,
  leadingAccessibilityLabel = "Back",
  trailingAccessibilityLabel = "More options",
  secondTrailingAccessibilityLabel = "More options",
  style,
}: AppBarProps) {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isCentered = variant === "centered";
  const showSecondTrailing = variant === "with-action";
  const hasMenu = Boolean(menuOptions?.length);
  const isMenuOpen = menuOpen ?? internalMenuOpen;

  const setMenuOpen = (nextOpen: boolean) => {
    if (menuOpen === undefined) {
      setInternalMenuOpen(nextOpen);
    }
    onMenuOpenChange?.(nextOpen);
  };

  const handleTrailingPress = () => {
    if (hasMenu) {
      setMenuOpen(!isMenuOpen);
      return;
    }
    onTrailingPress?.();
  };

  const handleMenuOptionPress = (
    _option: MenuOption,
    index: number,
  ) => {
    menuOptions?.[index]?.onPress?.();
    setMenuOpen(false);
  };

  const leading =
    leadingIcon ?? (
      <Icon name="chevron-left" size={iconSize.lg} color={colors.text.primary} />
    );

  const trailing =
    trailingIcon ?? (
      <Icon name="more" size={iconSize.lg} color={colors.text.primary} />
    );

  const secondTrailing =
    secondTrailingIcon ?? (
      <Icon name="more" size={iconSize.lg} color={colors.text.primary} />
    );

  return (
    <View style={[styles.root, isMenuOpen ? styles.rootOpen : null, style]}>
      <View style={styles.bar}>
        <AppBarIconSlot
          accessibilityLabel={leadingAccessibilityLabel}
          onPress={onLeadingPress}
        >
          {leading}
        </AppBarIconSlot>

        {isCentered ? (
          <View style={styles.centeredTitleWrap}>
            <Text numberOfLines={1} style={[styles.title, styles.titleCentered]}>
              {title}
            </Text>
          </View>
        ) : (
          <Text numberOfLines={1} style={[styles.title, styles.titleStart]}>
            {title}
          </Text>
        )}

        <View style={styles.trailingGroup}>
          <AppBarIconSlot
            accessibilityLabel={
              hasMenu ? "Open menu" : trailingAccessibilityLabel
            }
            expanded={hasMenu ? isMenuOpen : undefined}
            onPress={handleTrailingPress}
          >
            {trailing}
          </AppBarIconSlot>

          {showSecondTrailing ? (
            <AppBarIconSlot
              accessibilityLabel={secondTrailingAccessibilityLabel}
              onPress={onSecondTrailingPress}
            >
              {secondTrailing}
            </AppBarIconSlot>
          ) : null}
        </View>
      </View>

      {hasMenu ? (
        <Menu
          onOptionPress={handleMenuOptionPress}
          options={menuOptions!.map((option) => ({ label: option.label }))}
          style={styles.menu}
          visible={isMenuOpen}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  rootOpen: {
    zIndex: 20,
  },
  bar: {
    minHeight: controlSize.appBar,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  iconSlot: {
    width: iconSize.lg,
    height: iconSize.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  titleStart: {
    flex: 1,
    minWidth: 0,
  },
  centeredTitleWrap: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  titleCentered: {
    textAlign: "center",
    width: "100%",
  },
  trailingGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  menu: {
    position: "absolute",
    top: "100%",
    right: spacing.md,
    minWidth: 160,
    marginTop: spacing.xxs,
  },
});
