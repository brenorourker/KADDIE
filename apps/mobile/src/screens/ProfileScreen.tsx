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
  spacing,
  typography,
} from "@kaddie/ui";
import { usePersona } from "../personas/PersonaProvider";

const AVATAR_SAND_BG = "#ECCBA4";
const AVATAR_SAND_TEXT = "#8B5C32";

type ProfileScreenProps = {
  clubName?: string;
  onBack: () => void;
  onLogOut: () => void;
};

type StatItemProps = {
  label: string;
  value: string;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type SuggestionRowProps = {
  name: string;
  initials: string;
  handicap: string;
  avatarBackgroundColor: string;
  avatarTextColor: string;
  onPress: () => void;
};

function SuggestionRow({
  name,
  initials,
  handicap,
  avatarBackgroundColor,
  avatarTextColor,
  onPress,
}: SuggestionRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionRowPressed]}
    >
      <Avatar
        initials={initials}
        initialsBackgroundColor={avatarBackgroundColor}
        initialsTextColor={avatarTextColor}
        size="md"
      />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionName}>{name}</Text>
        <Text style={styles.suggestionHandicap}>{handicap}</Text>
      </View>
      <Icon color={colors.text.primary} name="plus" size={iconSize.md} />
    </Pressable>
  );
}

export function ProfileScreen({ clubName, onBack, onLogOut }: ProfileScreenProps) {
  const { activePersona } = usePersona();
  const profileData = activePersona.data.profile;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  return (
    <View style={styles.root}>
      <AppBar
        title="Profile"
        variant="centered"
        menuOptions={[
          {
            label: "Edit profile",
            onPress: () => Alert.alert("Edit profile", "Not connected yet."),
          },
          {
            label: "Log out",
            onPress: onLogOut,
          },
        ]}
        onLeadingPress={onBack}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.profileHeader}>
          <Avatar
            initials={profileData.initials}
            initialsBackgroundColor={AVATAR_SAND_BG}
            initialsTextColor={AVATAR_SAND_TEXT}
            size="xl"
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.profileClub}>
            {clubName ?? profileData.club}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatItem label="HANDICAP" value={profileData.handicap} />
          <View style={styles.statDivider} />
          <StatItem label="ROUNDS" value={String(profileData.rounds)} />
          <View style={styles.statDivider} />
          <StatItem
            label="ACHIEVEMENTS"
            value={String(profileData.achievements)}
          />
        </View>

        <View style={styles.sectionSpacer} />

        <Text style={styles.sectionLabel}>PEOPLE YOU MIGHT KNOW</Text>

        <View style={styles.suggestions}>
          {profileData.suggestions.map((person) => (
            <SuggestionRow
              key={person.id}
              avatarBackgroundColor={person.avatarBackgroundColor}
              avatarTextColor={person.avatarTextColor}
              handicap={person.handicap}
              initials={person.initials}
              name={person.name}
              onPress={() => Alert.alert("Add friend", `Add ${person.name}?`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const PROFILE_AVATAR_SIZE = 96;
const STATS_ROW_PADDING = spacing["2xl"] + spacing.lg;

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
    paddingTop: spacing.lg,
  },
  profileHeader: {
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing["2xl"],
  },
  profileAvatar: {
    borderRadius: PROFILE_AVATAR_SIZE / 2,
    height: PROFILE_AVATAR_SIZE,
    width: PROFILE_AVATAR_SIZE,
  },
  profileName: {
    ...typography.headingH1,
    color: colors.text.primary,
    textAlign: "center",
  },
  profileClub: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: "center",
  },
  statsRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: STATS_ROW_PADDING,
    paddingVertical: spacing.md,
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    gap: spacing.xxs,
    width: 90,
  },
  statValue: {
    ...typography.headingH2,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  statDivider: {
    backgroundColor: colors.border.default,
    height: 32,
    width: 1,
  },
  sectionSpacer: {
    height: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.lg,
    textTransform: "uppercase",
  },
  suggestions: {
    width: "100%",
  },
  suggestionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  suggestionRowPressed: {
    backgroundColor: colors.background.muted,
  },
  suggestionContent: {
    flex: 1,
    gap: spacing.xxxs,
    minWidth: 0,
  },
  suggestionName: {
    ...typography.bodyDefault,
    color: colors.text.primary,
  },
  suggestionHandicap: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
