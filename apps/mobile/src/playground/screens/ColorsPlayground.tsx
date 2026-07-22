import {
  colorsCatalog,
  fontFamily,
  radii,
  spacing,
  typography,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";
import { Text, View } from "react-native";
import { PlaygroundScreen } from "../PlaygroundLayout";

function isLightHex(hex: string): boolean {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.85;
}

function ColorSwatch({ value }: { value: string }) {
  const styles = useColorsPlaygroundStyles();
  const light = isLightHex(value);

  return (
    <View
      style={[
        styles.swatch,
        { backgroundColor: value },
        light ? styles.swatchBorder : null,
      ]}
    />
  );
}

export function ColorsPlayground({ onBack }: { onBack: () => void }) {
  const styles = useColorsPlaygroundStyles();

  return (
    <PlaygroundScreen title="Colors" onBack={onBack}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>FOUNDATIONS</Text>
        <Text style={styles.introTitle}>Colors</Text>
        <Text style={styles.introBody}>
          Tokens collected from components in this playground. Each swatch shows
          where the color is used today.
        </Text>
      </View>

      <View style={styles.groups}>
        {colorsCatalog.map((group) => (
          <View key={group.id} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupDescription}>{group.description}</Text>
            </View>

            <View style={styles.list}>
              {group.colors.map((entry) => (
                <View key={entry.id} style={styles.card}>
                  <ColorSwatch value={entry.value} />
                  <View style={styles.meta}>
                    <Text style={styles.tokenName}>{entry.id}</Text>
                    <Text style={styles.hex}>{entry.value.toUpperCase()}</Text>
                    {entry.usedBy.length > 0 ? (
                      <Text style={styles.usedBy}>
                        {entry.usedBy.join(" · ")}
                      </Text>
                    ) : (
                      <Text style={styles.unused}>
                        Not used in playground yet
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </PlaygroundScreen>
  );
}

function useColorsPlaygroundStyles() {
  return useThemedStyles((c: ColorTokens) => ({
    intro: {
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderLegacy,
    },
    eyebrow: {
      fontFamily: fontFamily.poppinsSemiBold,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "600" as const,
      letterSpacing: 0.165,
      color: c.text.tertiary,
      textTransform: "uppercase" as const,
    },
    introTitle: {
      fontFamily: fontFamily.poppinsBold,
      fontSize: 28,
      lineHeight: 36,
      fontWeight: "700" as const,
      letterSpacing: -0.28,
      color: c.text.primary,
    },
    introBody: {
      ...typography.bodyLarge,
      color: c.text.secondary,
    },
    groups: {
      gap: spacing.xl,
    },
    group: {
      gap: spacing.md,
    },
    groupHeader: {
      gap: spacing.xxs,
    },
    groupName: {
      fontFamily: fontFamily.poppinsSemiBold,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "600" as const,
      color: c.text.primary,
    },
    groupDescription: {
      ...typography.bodySmall,
      color: c.text.tertiary,
    },
    list: {
      gap: spacing.sm,
    },
    card: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderLegacy,
    },
    swatch: {
      width: 48,
      height: 48,
      borderRadius: radii.sm,
    },
    swatchBorder: {
      borderWidth: 1,
      borderColor: c.border.default,
    },
    meta: {
      flex: 1,
      gap: spacing.xxxs,
    },
    tokenName: {
      fontFamily: fontFamily.poppinsSemiBold,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600" as const,
      color: c.text.primary,
    },
    hex: {
      fontFamily: fontFamily.poppinsRegular,
      fontSize: 12,
      lineHeight: 18,
      color: c.text.secondary,
    },
    usedBy: {
      fontFamily: fontFamily.poppinsRegular,
      fontSize: 11,
      lineHeight: 16,
      color: c.text.tertiary,
    },
    unused: {
      fontFamily: fontFamily.poppinsRegular,
      fontSize: 11,
      lineHeight: 16,
      fontStyle: "italic" as const,
      color: c.text.tertiary,
    },
  }));
}
