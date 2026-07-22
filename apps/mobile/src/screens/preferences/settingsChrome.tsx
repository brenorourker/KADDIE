import { type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import {
  Badge,
  Icon,
  iconSize,
  radii,
  spacing,
  Switch,
  typography,
  useColors,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";

export function SettingsSection({ label }: { label: string }) {
  const styles = useSettingsChromeStyles();
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

export function SettingsGroup({ children }: { children: ReactNode }) {
  const styles = useSettingsChromeStyles();
  return <View style={styles.group}>{children}</View>;
}

export function SettingsRow({
  title,
  supportingText,
  value,
  badgeCount,
  showChevron = true,
  isLast = false,
  selected = false,
  onPress,
  trailing,
}: {
  title: string;
  supportingText?: string;
  value?: string;
  badgeCount?: number;
  showChevron?: boolean;
  isLast?: boolean;
  selected?: boolean;
  onPress?: () => void;
  trailing?: ReactNode;
}) {
  const colors = useColors();
  const styles = useSettingsChromeStyles();
  const isInteractive = Boolean(onPress);
  const content = (
    <>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {supportingText ? (
          <Text style={styles.rowSupporting}>{supportingText}</Text>
        ) : null}
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {badgeCount !== undefined ? (
        <Badge color="error" count={badgeCount} type="count" />
      ) : null}
      {trailing}
      {selected ? (
        <Icon color={colors.action.primary} name="check" size={iconSize.md} />
      ) : null}
      {showChevron && !trailing && !selected ? (
        <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
      ) : null}
    </>
  );

  if (!isInteractive) {
    return (
      <View style={[styles.row, !isLast && styles.rowBorder]}>{content}</View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

export function SettingsSwitchRow({
  title,
  supportingText,
  value,
  onValueChange,
  isLast = false,
}: {
  title: string;
  supportingText?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
}) {
  const styles = useSettingsChromeStyles();
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {supportingText ? (
          <Text style={styles.rowSupporting}>{supportingText}</Text>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={title}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export function SettingsBodyText({ children }: { children: string }) {
  const styles = useSettingsChromeStyles();
  return <Text style={styles.bodyText}>{children}</Text>;
}

export function usePreferenceScreenStyles() {
  return useThemedStyles((colors: ColorTokens) => ({
    root: {
      flex: 1,
      backgroundColor: colors.background.muted,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      gap: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
  }));
}

function useSettingsChromeStyles() {
  return useThemedStyles((colors: ColorTokens) => ({
    sectionLabel: {
      ...typography.caption,
      color: colors.text.tertiary,
      textTransform: "uppercase" as const,
    },
    group: {
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default,
      borderRadius: radii.lg,
      borderWidth: 1,
      overflow: "hidden" as const,
    },
    row: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    rowBorder: {
      borderBottomColor: colors.border.default,
      borderBottomWidth: 1,
    },
    rowPressed: {
      backgroundColor: colors.background.muted,
    },
    rowText: {
      flex: 1,
      gap: spacing.xxs,
      minWidth: 0,
    },
    rowTitle: {
      ...typography.bodyDefault,
      color: colors.text.primary,
    },
    rowSupporting: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    rowValue: {
      ...typography.bodyDefault,
      color: colors.text.secondary,
    },
    bodyText: {
      ...typography.bodyDefault,
      color: colors.text.secondary,
    },
  }));
}
