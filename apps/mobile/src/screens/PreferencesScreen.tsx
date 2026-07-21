import { useState } from "react";
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
  colors,
  Icon,
  iconSize,
  radii,
  spacing,
  ToggleButton,
  typography,
} from "@kaddie/ui";
import { usePersona } from "../personas/PersonaProvider";
import {
  PreferenceSectionScreen,
  type PreferenceSectionId,
} from "./preferences";
import {
  preferenceScreenStyles,
  SettingsGroup,
  SettingsRow,
  SettingsSection,
  SettingsSwitchRow,
} from "./preferences/settingsChrome";

type PreferencesScreenProps = {
  onBack: () => void;
  onOpenProfile: () => void;
};

export function PreferencesScreen({ onBack, onOpenProfile }: PreferencesScreenProps) {
  const { activePersona } = usePersona();
  const preferencesData = activePersona.data.preferences;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [unitsIndex, setUnitsIndex] = useState(0);
  const [windIndex, setWindIndex] = useState(0);
  const [adjustForWeather, setAdjustForWeather] = useState(true);
  const [autoUpdateClubDistances, setAutoUpdateClubDistances] = useState(true);
  const [activeSection, setActiveSection] =
    useState<PreferenceSectionId | null>(null);

  const showComingSoon = (label: string) => {
    Alert.alert(label, "Not connected yet.");
  };

  if (activeSection) {
    return (
      <PreferenceSectionScreen
        sectionId={activeSection}
        onBack={() => setActiveSection(null)}
        onOpenSection={setActiveSection}
      />
    );
  }

  return (
    <View style={preferenceScreenStyles.root}>
      <AppBar title="Preferences" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[
          preferenceScreenStyles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        style={preferenceScreenStyles.scroll}
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
            onPress={() => setActiveSection("language")}
          />
          <SettingsRow
            title="Personality"
            value={preferencesData.myKaddie.personality}
            onPress={() => setActiveSection("personality")}
          />
          <SettingsRow
            isLast
            title="Parameters"
            onPress={() => setActiveSection("parameters")}
          />
        </SettingsGroup>

        <SettingsSection label="ACCOUNT" />
        <SettingsGroup>
          <SettingsRow
            title="Subscription"
            value={preferencesData.account.subscription}
            onPress={() => setActiveSection("subscription")}
          />
          <SettingsRow
            badgeCount={preferencesData.account.notificationCount}
            title="Notifications"
            onPress={() => setActiveSection("notifications")}
          />
          <SettingsRow
            isLast
            title="Privacy & security"
            onPress={() => setActiveSection("privacy")}
          />
        </SettingsGroup>

        <SettingsSection label="SUPPORT" />
        <SettingsGroup>
          <SettingsRow
            title="Help center"
            onPress={() => setActiveSection("help")}
          />
          <SettingsRow
            title="Contact support"
            onPress={() => setActiveSection("contact")}
          />
          <SettingsRow
            isLast
            title="About"
            value={preferencesData.support.version}
            onPress={() => setActiveSection("about")}
          />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
}

const UNITS_TOGGLE_WIDTH = 162;

const styles = StyleSheet.create({
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
  rowTitle: {
    ...typography.bodyDefault,
    color: colors.text.primary,
  },
  rowTitleFlex: {
    flex: 1,
    minWidth: 0,
  },
  unitsToggle: {
    width: UNITS_TOGGLE_WIDTH,
  },
});
