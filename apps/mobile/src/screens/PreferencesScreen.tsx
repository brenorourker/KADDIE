import { useState, type ReactNode } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  Avatar,
  Badge,
  colors,
  Icon,
  iconSize,
  radii,
  spacing,
  Switch,
  ToggleButton,
  typography,
} from "@kaddie/ui";
import { usePersona } from "../personas/PersonaProvider";

type PreferencesScreenProps = {
  onBack: () => void;
  onOpenProfile: () => void;
};

type SettingsSectionProps = {
  label: string;
};

type SettingsGroupProps = {
  children: ReactNode;
};

type SettingsRowProps = {
  title: string;
  supportingText?: string;
  value?: string;
  badgeCount?: number;
  showChevron?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  trailing?: ReactNode;
};

function SettingsSection({ label }: SettingsSectionProps) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function SettingsGroup({ children }: SettingsGroupProps) {
  return <View style={styles.group}>{children}</View>;
}

function SettingsRow({
  title,
  supportingText,
  value,
  badgeCount,
  showChevron = true,
  isLast = false,
  onPress,
  trailing,
}: SettingsRowProps) {
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
      {showChevron && !trailing ? (
        <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
      ) : null}
    </>
  );

  if (!isInteractive) {
    return (
      <View style={[styles.row, !isLast && styles.rowBorder]}>
        {content}
      </View>
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

function SettingsSwitchRow({
  title,
  value,
  onValueChange,
  isLast = false,
}: {
  title: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={[styles.rowTitle, styles.rowTitleFlex]}>{title}</Text>
      <Switch
        accessibilityLabel={title}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export function PreferencesScreen({ onBack, onOpenProfile }: PreferencesScreenProps) {
  const { activePersona } = usePersona();
  const preferencesData = activePersona.data.preferences;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [unitsIndex, setUnitsIndex] = useState(0);
  const [windIndex, setWindIndex] = useState(0);
  const [adjustForWeather, setAdjustForWeather] = useState(true);
  const [autoUpdateClubDistances, setAutoUpdateClubDistances] = useState(true);

  const showComingSoon = (label: string) => {
    Alert.alert(label, "Not connected yet.");
  };

  return (
    <View style={styles.root}>
      <AppBar title="Preferences" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onOpenProfile}
          style={({ pressed }) => [styles.profileCard, pressed && styles.rowPressed]}
        >
          <Avatar initials={preferencesData.user.initials} size="lg" />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{preferencesData.user.fullName}</Text>
            <Text style={styles.profileEmail}>{preferencesData.user.email}</Text>
          </View>
          <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
        </Pressable>

        <SettingsSection label="GAME SETTINGS" />
        <SettingsGroup>
          <View style={[styles.row, styles.unitsRow, styles.rowBorder]}>
            <Text style={[styles.rowTitle, styles.rowTitleFlex]}>Distance</Text>
            <ToggleButton
              options={[{ label: "Yards" }, { label: "Meters" }]}
              style={styles.unitsToggle}
              value={unitsIndex}
              variant="pill"
              onValueChange={setUnitsIndex}
            />
          </View>
          <View style={[styles.row, styles.unitsRow, styles.rowBorder]}>
            <Text style={[styles.rowTitle, styles.rowTitleFlex]}>Wind</Text>
            <ToggleButton
              options={[{ label: "Mph" }, { label: "Kph" }]}
              style={styles.unitsToggle}
              value={windIndex}
              variant="pill"
              onValueChange={setWindIndex}
            />
          </View>
          <SettingsSwitchRow
            title="Adjust for weather"
            value={adjustForWeather}
            onValueChange={setAdjustForWeather}
          />
          <SettingsSwitchRow
            title="Auto update club distances"
            value={autoUpdateClubDistances}
            onValueChange={setAutoUpdateClubDistances}
          />
          <SettingsRow
            isLast
            title="App appearance"
            value={preferencesData.gameSettings.appAppearance}
            onPress={() => showComingSoon("App appearance")}
          />
        </SettingsGroup>

        <SettingsSection label="MY KADDIE" />
        <SettingsGroup>
          <SettingsRow
            title="Language"
            value={preferencesData.myKaddie.language}
            onPress={() => showComingSoon("Language")}
          />
          <SettingsRow
            title="Personality"
            value={preferencesData.myKaddie.personality}
            onPress={() => showComingSoon("Personality")}
          />
          <SettingsRow
            isLast
            title="Parameters"
            onPress={() => showComingSoon("Parameters")}
          />
        </SettingsGroup>

        <SettingsSection label="ACCOUNT" />
        <SettingsGroup>
          <SettingsRow
            title="Subscription"
            value={preferencesData.account.subscription}
            onPress={() => showComingSoon("Subscription")}
          />
          <SettingsRow
            badgeCount={preferencesData.account.notificationCount}
            title="Notifications"
            onPress={() => showComingSoon("Notifications")}
          />
          <SettingsRow
            title="Privacy & security"
            onPress={() => showComingSoon("Privacy & security")}
          />
          <SettingsRow
            isLast
            supportingText={preferencesData.account.linkedAccount}
            title="Linked accounts"
            onPress={() => showComingSoon("Linked accounts")}
          />
        </SettingsGroup>

        <SettingsSection label="SUPPORT" />
        <SettingsGroup>
          <SettingsRow
            title="Help center"
            onPress={() => showComingSoon("Help center")}
          />
          <SettingsRow
            title="Contact support"
            onPress={() => showComingSoon("Contact support")}
          />
          <SettingsRow
            isLast
            title="About"
            value={preferencesData.support.version}
            onPress={() => showComingSoon("About")}
          />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
}

const UNITS_TOGGLE_WIDTH = 143;

const styles = StyleSheet.create({
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
  profileCard: {
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.lg,
    padding: spacing.lg,
  },
  profileText: {
    flex: 1,
    gap: spacing.xxxs,
    minWidth: 0,
  },
  profileName: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  group: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  unitsRow: {
    minHeight: 72,
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
  rowTitleFlex: {
    flex: 1,
    minWidth: 0,
  },
  rowSupporting: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  rowValue: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  unitsToggle: {
    width: UNITS_TOGGLE_WIDTH,
  },
});
