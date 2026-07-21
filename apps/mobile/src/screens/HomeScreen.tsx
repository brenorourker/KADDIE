import { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActionTile,
  Avatar,
  Button,
  colors,
  controlSize,
  Icon,
  iconSize,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { ConfigureRoundModal } from "../components/ConfigureRoundModal";
import { golfCourseImage } from "../personas/data/shared";
import { usePersona } from "../personas/PersonaProvider";
import {
  formatPlayersSummary,
  formatRoundFormatLabel,
  getCourseLabel,
  getTeeLabel,
  type RoundConfig,
} from "./roundConfig";

const AVATAR_SAND_BG = "#ECCBA4";
const AVATAR_SAND_TEXT = "#8B5C32";
const SECTION_GAP = 40;

type HomeScreenProps = {
  onOpenProfile?: () => void;
  onOpenPreferences?: () => void;
  onOpenMyBag?: () => void;
  /** True when a round was left without ending — CTA becomes Resume. */
  canResumeRound?: boolean;
  /** Config for the paused round (shown on the card while resumable). */
  resumeRoundConfig?: RoundConfig;
  onStartRound?: (config: RoundConfig) => void;
  onResumeRound?: () => void;
};

function ActionTileIconImage({ source }: { source: ImageSourcePropType }) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      source={source}
      style={styles.actionIconImage}
    />
  );
}

export function HomeScreen({
  onOpenProfile,
  onOpenPreferences,
  onOpenMyBag,
  canResumeRound = false,
  resumeRoundConfig,
  onStartRound,
  onResumeRound,
}: HomeScreenProps) {
  const { activePersona, bagClubCount } = usePersona();
  const homeData = activePersona.data.home;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [configureVisible, setConfigureVisible] = useState(false);
  const [roundConfig, setRoundConfig] = useState<RoundConfig>(activePersona.data.round);
  const myBagClubCount = bagClubCount;
  const cardConfig =
    canResumeRound && resumeRoundConfig ? resumeRoundConfig : roundConfig;

  const handleConfigureDone = (config: RoundConfig) => {
    setRoundConfig(config);
    setConfigureVisible(false);
  };

  return (
    <>
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      style={styles.root}
    >
      <View style={styles.header}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingLabel}>{homeData.greeting}</Text>
          <Text style={styles.greetingName}>
            {homeData.userName}{" "}
            <Text style={styles.handicap}>({homeData.handicap})</Text>
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onOpenProfile}
        >
          <Avatar
            initials={homeData.initials}
            initialsBackgroundColor={AVATAR_SAND_BG}
            initialsTextColor={AVATAR_SAND_TEXT}
            size="md"
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.roundCard}>
          <View style={styles.roundMedia}>
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="cover"
              source={golfCourseImage}
              style={styles.roundImage}
            />
          </View>

          <View style={styles.roundDetails}>
            <Text style={styles.roundClub}>
              {getCourseLabel(cardConfig.course)}
              <Text style={styles.roundMetaDivider}>   |   </Text>
              {getTeeLabel(cardConfig.tees)}
            </Text>
            <Text style={styles.roundMeta}>
              {formatPlayersSummary(cardConfig.golfers)}
              <Text style={styles.roundMetaDivider}>   |   </Text>
              {formatRoundFormatLabel(cardConfig.format)}
            </Text>
          </View>

          <View style={styles.roundActions}>
            <Button
              label={canResumeRound ? "Resume round" : "Start a round"}
              size="md"
              style={styles.startRoundButton}
              trailingIcon={
                <Icon
                  color={colors.action.onPrimary}
                  name="chevron-right"
                  size={iconSize.md}
                />
              }
              onPress={() => {
                if (canResumeRound) {
                  onResumeRound?.();
                  return;
                }
                onStartRound?.(roundConfig);
              }}
            />
            <Button
              label="Configure"
              size="md"
              style={styles.configureButton}
              variant="secondary"
              disabled={canResumeRound}
              onPress={() => setConfigureVisible(true)}
            />
          </View>
        </View>

        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsHeader}>
            <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert("Quick actions", "Not connected yet.")}
            >
              <Text style={styles.seeAllLink}>SEE ALL</Text>
            </Pressable>
          </View>

          <View style={styles.quickActionsGrid}>
            <View style={styles.quickActionsRow}>
              <ActionTile
                fillWidth
                icon={<ActionTileIconImage source={homeData.quickActions[0].icon} />}
                showChevron={false}
                subtitle={homeData.quickActions[0].subtitle}
                title={homeData.quickActions[0].title}
                onPress={() => Alert.alert(homeData.quickActions[0].title, "Not connected yet.")}
              />
              <ActionTile
                fillWidth
                icon={<ActionTileIconImage source={homeData.quickActions[1].icon} />}
                showChevron={false}
                subtitle={homeData.quickActions[1].subtitle}
                title={homeData.quickActions[1].title}
                onPress={onOpenPreferences}
              />
            </View>

            <View style={styles.quickActionsRow}>
              <ActionTile
                fillWidth
                icon={<ActionTileIconImage source={homeData.quickActions[2].icon} />}
                showChevron={false}
                subtitle={homeData.quickActions[2].subtitle}
                title={homeData.quickActions[2].title}
                onPress={() => Alert.alert(homeData.quickActions[2].title, "Not connected yet.")}
              />
              <ActionTile
                fillWidth
                icon={<ActionTileIconImage source={homeData.quickActions[3].icon} />}
                showChevron={false}
                subtitle={homeData.quickActions[3].subtitle}
                title={`My bag (${myBagClubCount})`}
                onPress={onOpenMyBag}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

    <ConfigureRoundModal
      initialValues={roundConfig}
      visible={configureVisible}
      onCancel={() => setConfigureVisible(false)}
      onDone={handleConfigureDone}
    />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 80,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greetingBlock: {
    gap: spacing.xxs,
  },
  greetingLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  greetingName: {
    ...typography.headingH2,
    color: colors.text.primary,
  },
  handicap: {
    ...typography.titleDefault,
    color: colors.text.primary,
  },
  content: {
    gap: SECTION_GAP,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxs,
  },
  roundCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
    width: "100%",
  },
  roundMedia: {
    backgroundColor: colors.background.muted,
    height: controlSize.mediaCardImageHeight,
    width: "100%",
  },
  roundImage: {
    height: "100%",
    width: "100%",
  },
  roundDetails: {
    gap: spacing.xxs,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  roundClub: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  roundMeta: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  roundMetaDivider: {
    color: colors.text.secondary,
  },
  roundActions: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    width: "100%",
  },
  startRoundButton: {
    flex: 3,
    minWidth: 0,
  },
  configureButton: {
    flex: 2,
    minWidth: 0,
  },
  quickActionsSection: {
    gap: spacing.md,
    width: "100%",
  },
  quickActionsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  seeAllLink: {
    ...typography.caption,
    color: colors.feedback.successFg,
    textTransform: "uppercase",
  },
  quickActionsGrid: {
    gap: spacing.md,
    width: "100%",
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  actionIconImage: {
    height: 28,
    width: 28,
  },
});
