import { Icon, iconNames, colors, radii, spacing, typography } from "@kaddie/ui";
import { StyleSheet, Text, View } from "react-native";
import { PlaygroundScreen } from "../PlaygroundLayout";

export function IconsPlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Icons" onBack={onBack}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>All icons (24px)</Text>
        <View style={styles.grid}>
          {iconNames.map((name) => (
            <View key={name} style={styles.cell}>
              <View style={styles.iconWrap}>
                <Icon name={name} size={24} />
              </View>
              <Text style={styles.iconLabel}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLegacy,
  },
  sectionLabel: {
    ...typography.buttonMd,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  cell: {
    width: 88,
    alignItems: "center",
    gap: spacing.xxs,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  iconLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: "center",
  },
});
