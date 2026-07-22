import {
  Icon,
  iconNames,
  radii,
  spacing,
  typography,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";
import { Text, View } from "react-native";
import { PlaygroundScreen } from "../PlaygroundLayout";

export function IconsPlayground({ onBack }: { onBack: () => void }) {
  const styles = useIconsPlaygroundStyles();

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

function useIconsPlaygroundStyles() {
  return useThemedStyles((c: ColorTokens) => ({
    section: {
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderLegacy,
    },
    sectionLabel: {
      ...typography.buttonMd,
      color: c.textMuted,
    },
    grid: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: spacing.sm,
    },
    cell: {
      width: 88,
      alignItems: "center" as const,
      gap: spacing.xxs,
    },
    iconWrap: {
      width: 48,
      height: 48,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderRadius: radii.sm,
      backgroundColor: c.surfaceMuted,
    },
    iconLabel: {
      ...typography.caption,
      color: c.text.tertiary,
      textAlign: "center" as const,
    },
  }));
}
