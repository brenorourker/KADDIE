import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  radii,
  spacing,
  ToggleButton,
  typography,
  useTheme,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";
import { useAppearance } from "../app/AppearanceProvider";
import { PlaygroundEntry, playgroundRegistry } from "./registry";

type PlaygroundHomeProps = {
  onSelect: (entry: PlaygroundEntry) => void;
  onClose?: () => void;
};

export function PlaygroundHome({ onSelect, onClose }: PlaygroundHomeProps) {
  const styles = useThemedStyles(createStyles);
  const { setAppearance } = useAppearance();
  const { resolvedScheme } = useTheme();
  const appearanceIndex = resolvedScheme === "dark" ? 1 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          {onClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close playground"
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeLabel}>← App</Text>
            </Pressable>
          ) : (
            <View />
          )}

          <ToggleButton
            options={[{ label: "Light" }, { label: "Dark" }]}
            style={styles.themeToggle}
            value={appearanceIndex}
            variant="pill"
            onValueChange={(index) =>
              setAppearance(index === 1 ? "dark" : "light")
            }
          />
        </View>
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

function createStyles(c: ColorTokens) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.background.muted,
    },
    header: {
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.border.default,
      backgroundColor: c.background.surface,
    },
    headerTopRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    closeButton: {
      alignSelf: "flex-start" as const,
      paddingVertical: spacing.xs,
    },
    closeLabel: {
      ...typography.buttonMd,
      color: c.action.primary,
    },
    themeToggle: {
      width: 152,
    },
    title: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: c.text.primary,
    },
    subtitle: {
      ...typography.body,
      color: c.text.secondary,
    },
    list: {
      padding: spacing.md,
      gap: spacing.sm,
    },
    row: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: c.background.surface,
      borderWidth: 1,
      borderColor: c.border.default,
    },
    rowPressed: {
      opacity: 0.9,
    },
    rowName: {
      ...typography.buttonMd,
      color: c.text.primary,
    },
    chevron: {
      fontSize: 24,
      color: c.text.secondary,
    },
  };
}
