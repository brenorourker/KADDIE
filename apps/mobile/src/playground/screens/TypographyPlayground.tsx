import {
  colors,
  fontFamily,
  radii,
  spacing,
  typography,
  typographyCatalog,
} from "@kaddie/ui";
import { StyleSheet, Text, View } from "react-native";
import { PlaygroundScreen } from "../PlaygroundLayout";

export function TypographyPlayground({ onBack }: { onBack: () => void }) {
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

const styles = StyleSheet.create({
  intro: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLegacy,
  },
  eyebrow: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 0.165,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  introTitle: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    letterSpacing: -0.28,
    color: colors.text.primary,
  },
  introBody: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLegacy,
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
    fontWeight: "600",
    color: colors.text.primary,
  },
  styleDescription: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "400",
    color: colors.text.tertiary,
  },
  sample: {
    color: colors.text.primary,
  },
  uppercase: {
    textTransform: "uppercase",
  },
});
