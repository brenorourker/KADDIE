import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  radii,
  spacing,
  typography,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";

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
  const styles = usePlaygroundLayoutStyles();

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
  const styles = usePlaygroundLayoutStyles();

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
  const styles = usePlaygroundLayoutStyles();

  return <View style={styles.configPanel}>{children}</View>;
}

type ConfigRowProps = {
  label: string;
  children: ReactNode;
};

export function ConfigRow({ label, children }: ConfigRowProps) {
  const styles = usePlaygroundLayoutStyles();

  return (
    <View style={styles.configRow}>
      <Text style={styles.configLabel}>{label}</Text>
      <View style={styles.configOptions}>{children}</View>
    </View>
  );
}

function usePlaygroundLayoutStyles() {
  return useThemedStyles((c: ColorTokens) => ({
    container: {
      flex: 1,
      backgroundColor: c.surfaceMuted,
    },
    header: {
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.borderLegacy,
      backgroundColor: c.surface,
    },
    backButton: {
      alignSelf: "flex-start" as const,
      paddingVertical: spacing.xs,
    },
    backLabel: {
      ...typography.buttonMd,
      color: c.action.primary,
    },
    title: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: c.text.primary,
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
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderLegacy,
    },
    variantLabel: {
      ...typography.buttonMd,
      color: c.textMuted,
    },
    variantPreview: {
      gap: spacing.sm,
    },
    configPanel: {
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderLegacy,
    },
    configRow: {
      gap: spacing.sm,
    },
    configLabel: {
      ...typography.buttonMd,
      color: c.text.primary,
    },
    configOptions: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: spacing.xs,
    },
  }));
}
