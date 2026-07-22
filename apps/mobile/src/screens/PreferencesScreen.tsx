import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  Avatar,
  Icon,
  iconSize,
  radii,
  spacing,
  ToggleButton,
  typography,
  useColors,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";
import { useAppearance } from "../app/AppearanceProvider";
import { usePersona } from "../personas/PersonaProvider";
import {
  PreferenceSectionScreen,
  type PreferenceSectionId,
} from "./preferences";
import {
  SettingsGroup,
  SettingsRow,
  SettingsSection,
  SettingsSwitchRow,
  usePreferenceScreenStyles,
} from "./preferences/settingsChrome";

type PreferencesScreenProps = {
  onBack: () => void;
  onOpenProfile: () => void;
};

function appearanceLabel(appearance: string) {
  if (appearance === "light") return "Light";
  if (appearance === "dark") return "Dark";
  return "System";
}

export function PreferencesScreen({ onBack, onOpenProfile }: PreferencesScreenProps) {
  const { activePersona } = usePersona();
  const { appearance } = useAppearance();
  const colors = useColors();
  const preferencesData = activePersona.data.preferences;
  const insets = useSafeAreaInsets();
  const screenStyles = usePreferenceScreenStyles();
  const styles = useThemedStyles((c: ColorTokens) => ({
    profileCard: {
      alignItems: "center" as const,
      backgroundColor: c.background.surface,
      borderColor: c.border.default,
      borderRadius: radii.lg,
      borderWidth: 1,
      flexDirection: "row" as const,
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
      color: c.text.primary,
    },
    profileEmail: {
      ...typography.bodySmall,
      color: c.text.secondary,
    },
    row: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    unitsRow: {
      minHeight: 72,
    },
    rowBorder: {
      borderBottomColor: c.border.default,
      borderBottomWidth: 1,
    },
    rowPressed: {
      backgroundColor: c.background.muted,
    },
    rowTitle: {
      ...typography.bodyDefault,
      color: c.text.primary,
    },
    rowTitleFlex: {
      flex: 1,
      minWidth: 0,
    },
    unitsToggle: {
      width: 162,
    },
  }));
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [unitsIndex, setUnitsIndex] = useState(0);
  const [windIndex, setWindIndex] = useState(0);
  const [adjustForWeather, setAdjustForWeather] = useState(true);
  const [autoUpdateClubDistances, setAutoUpdateClubDistances] = useState(true);
  const [activeSection, setActiveSection] =
    useState<PreferenceSectionId | null>(null);

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
    <View style={screenStyles.root}>
      <AppBar title="Preferences" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[
          screenStyles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        style={screenStyles.scroll}
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
            value={appearanceLabel(appearance)}
            onPress={() => setActiveSection("appearance")}
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
