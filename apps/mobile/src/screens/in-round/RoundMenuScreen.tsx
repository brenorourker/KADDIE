import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  colors,
  Icon,
  type IconName,
  iconSize,
  Modal,
  spacing,
  typography,
} from "@kaddie/ui";
import { ConfigureRoundModal } from "../../components/ConfigureRoundModal";
import { useRoundMap } from "../../round/RoundMapProvider";
import { inRoundColors } from "../../round/inRoundTheme";
import {
  formatRoundFormatLabel,
  getCourseLabel,
} from "../roundConfig";

type RoundMenuScreenProps = {
  /** False while the round is paused — closes modals so portals don't block resume. */
  isActive?: boolean;
  onLeaveRound: () => void;
  onEndRound: () => void;
  onOpenPreferences: () => void;
};

type MenuRowId = "round-settings" | "preferences" | "back" | "end";

type ConfirmKind = "back" | "end" | null;

const MENU_ROWS: ReadonlyArray<{
  id: MenuRowId;
  label: string;
  icon: IconName;
}> = [
  { id: "round-settings", label: "Round settings", icon: "settings" },
  { id: "preferences", label: "Preferences", icon: "preferences" },
  { id: "back", label: "Back to main menu", icon: "exit" },
  { id: "end", label: "End round", icon: "flag" },
];

export function RoundMenuScreen({
  isActive = true,
  onLeaveRound,
  onEndRound,
  onOpenPreferences,
}: RoundMenuScreenProps) {
  const insets = useSafeAreaInsets();
  const { config, updateConfig } = useRoundMap();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);

  useEffect(() => {
    if (!isActive) {
      setSettingsVisible(false);
      setConfirmKind(null);
    }
  }, [isActive]);

  const handleRowPress = (id: MenuRowId) => {
    switch (id) {
      case "round-settings":
        setSettingsVisible(true);
        break;
      case "preferences":
        onOpenPreferences();
        break;
      case "back":
        setConfirmKind("back");
        break;
      case "end":
        setConfirmKind("end");
        break;
    }
  };

  const leaveOrEnd = (kind: ConfirmKind) => {
    setConfirmKind(null);
    // Let the modal portal close before pausing/unmounting the round tree.
    // Otherwise RN Web can leave an invisible overlay that eats presses on resume.
    requestAnimationFrame(() => {
      if (kind === "back") {
        onLeaveRound();
      } else if (kind === "end") {
        onEndRound();
      }
    });
  };

  return (
    <View style={[styles.root, { marginTop: -insets.top }]}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.xs },
        ]}
      >
        <Text style={styles.sectionLabel}>ROUND</Text>
        <Text style={styles.courseName}>{getCourseLabel(config.course)}</Text>
        <Text style={styles.formatLabel}>
          {formatRoundFormatLabel(config.format)}
        </Text>

        <View style={styles.menuList}>
          <View style={styles.divider} />
          {MENU_ROWS.map((row) => (
            <View key={row.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={row.label}
                onPress={() => handleRowPress(row.id)}
                style={({ pressed }) => [
                  styles.menuRow,
                  pressed && styles.menuRowPressed,
                ]}
              >
                <Icon
                  color={inRoundColors.textInverse}
                  name={row.icon}
                  size={iconSize.md}
                />
                <Text style={styles.menuLabel}>{row.label}</Text>
              </Pressable>
              <View style={styles.divider} />
            </View>
          ))}
        </View>
      </View>

      <ConfigureRoundModal
        visible={isActive && settingsVisible}
        initialValues={config}
        onCancel={() => setSettingsVisible(false)}
        onDone={(next) => {
          updateConfig(next);
          setSettingsVisible(false);
        }}
      />

      <Modal
        body={
          confirmKind === "back"
            ? "Leave this round and return to the main menu?"
            : "Are you sure you want to end this round?"
        }
        cancelLabel="Cancel"
        confirmLabel={confirmKind === "back" ? "Leave round" : "End round"}
        icon={
          <Icon
            color={colors.feedback.infoFg}
            name={confirmKind === "back" ? "exit" : "flag"}
            size={iconSize.lg}
          />
        }
        title={confirmKind === "back" ? "Back to main menu" : "End round"}
        visible={isActive && confirmKind !== null}
        onCancelPress={() => setConfirmKind(null)}
        onConfirmPress={() => leaveOrEnd(confirmKind)}
        onRequestClose={() => setConfirmKind(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: inRoundColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  sectionLabel: {
    ...typography.overline,
    letterSpacing: 0.04,
    color: colors.action.onDisabled,
  },
  courseName: {
    ...typography.headingH2,
    color: inRoundColors.textInverse,
    marginTop: spacing.xs,
  },
  formatLabel: {
    ...typography.bodySmall,
    color: inRoundColors.textInverse,
    marginTop: spacing.xxs,
  },
  menuList: {
    marginTop: spacing["2xl"] + spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  menuRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuRowPressed: {
    opacity: 0.7,
  },
  menuLabel: {
    ...typography.bodyDefault,
    color: inRoundColors.textInverse,
  },
});
