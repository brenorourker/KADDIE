import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radii, spacing, typography } from "@kaddie/ui";
import { PlaygroundEntry, playgroundRegistry } from "./registry";

type PlaygroundHomeProps = {
  onSelect: (entry: PlaygroundEntry) => void;
  onClose?: () => void;
};

export function PlaygroundHome({ onSelect, onClose }: PlaygroundHomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onClose ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close playground"
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeLabel}>← App</Text>
          </Pressable>
        ) : null}
        <Text style={styles.title}>KADDIE Components</Text>
        <Text style={styles.subtitle}>Design System</Text>
      </View>

      <FlatList
        data={playgroundRegistry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
      />
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
  closeButton: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
  },
  closeLabel: {
    ...typography.buttonMd,
    color: colors.action.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLegacy,
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowName: {
    ...typography.buttonMd,
    color: colors.text.primary,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
});
