import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "@kaddie/ui";

type PlaygroundScreenProps = {
  title: string;
  onBack: () => void;
  children: ReactNode;
};

export function PlaygroundScreen({
  title,
  onBack,
  children,
}: PlaygroundScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backLabel}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </View>
  );
}

type VariantRowProps = {
  label: string;
  children: ReactNode;
};

export function VariantRow({ label, children }: VariantRowProps) {
  return (
    <View style={styles.variantRow}>
      <Text style={styles.variantLabel}>{label}</Text>
      <View style={styles.variantPreview}>{children}</View>
    </View>
  );
}

type ConfigPanelProps = {
  children: ReactNode;
};

export function ConfigPanel({ children }: ConfigPanelProps) {
  return <View style={styles.configPanel}>{children}</View>;
}

type ConfigRowProps = {
  label: string;
  children: ReactNode;
};

export function ConfigRow({ label, children }: ConfigRowProps) {
  return (
    <View style={styles.configRow}>
      <Text style={styles.configLabel}>{label}</Text>
      <View style={styles.configOptions}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLegacy,
    backgroundColor: colors.surface,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
  },
  backLabel: {
    ...typography.buttonMd,
    color: colors.action.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  variantRow: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLegacy,
  },
  variantLabel: {
    ...typography.buttonMd,
    color: colors.textMuted,
  },
  variantPreview: {
    gap: spacing.sm,
  },
  configPanel: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLegacy,
  },
  configRow: {
    gap: spacing.sm,
  },
  configLabel: {
    ...typography.buttonMd,
    color: colors.text.primary,
  },
  configOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
});
