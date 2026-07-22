import {
  fontFamily,
  radii,
  spacing,
  typography,
  typographyCatalog,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";
import { Text, View } from "react-native";
import { PlaygroundScreen } from "../PlaygroundLayout";

export function TypographyPlayground({ onBack }: { onBack: () => void }) {
  const styles = useTypographyPlaygroundStyles();

  return (
    <PlaygroundScreen title="Typography" onBack={onBack}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>FOUNDATIONS</Text>
        <Text style={styles.introTitle}>Typography</Text>
        <Text style={styles.introBody}>
          Poppins type ramp. Use the text style — it captures size,
          line-height, weight, and letter-spacing.
        </Text>
      </View>

      <View style={styles.list}>
        {typographyCatalog.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <View style={styles.meta}>
              <Text style={styles.styleName}>{entry.name}</Text>
              <Text style={styles.styleDescription}>{entry.description}</Text>
            </View>
            <Text
              style={[
                styles.sample,
                entry.style,
                entry.uppercase ? styles.uppercase : null,
              ]}
            >
              {entry.sample}
            </Text>
          </View>
        ))}
      </View>
    </PlaygroundScreen>
  );
}

function useTypographyPlaygroundStyles() {
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
    list: {
      gap: spacing.md,
    },
    card: {
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderLegacy,
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    meta: {
      gap: spacing.xxs,
    },
    styleName: {
      fontFamily: fontFamily.poppinsSemiBold,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600" as const,
      color: c.text.primary,
    },
    styleDescription: {
      fontFamily: fontFamily.poppinsRegular,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "400" as const,
      color: c.text.tertiary,
    },
    sample: {
      color: c.text.primary,
    },
    uppercase: {
      textTransform: "uppercase" as const,
    },
  }));
}
