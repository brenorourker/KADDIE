import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Checkbox, colors, radii, spacing, typography } from "@kaddie/ui";
import type { AppRoute } from "./routes";
import { usePersona } from "../personas/PersonaProvider";

type AppHomeProps = {
  onLaunch: (route: AppRoute) => void;
  onOpenPlayground: () => void;
};

export function AppHome({ onLaunch, onOpenPlayground }: AppHomeProps) {
  const { personas, activePersonaId, setActivePersonaId, activePersona } =
    usePersona();
  const [startFromLogin, setStartFromLogin] = useState(false);

  const handleLaunch = () => {
    const entryRoute = startFromLogin ? "login" : activePersona.entryRoute;
    onLaunch(entryRoute);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Kaddie</Text>
        <Text style={styles.subtitle}>Persona launcher</Text>
      </View>

      <View style={styles.personaList}>
        {personas.map((persona) => {
          const isSelected = persona.id === activePersonaId;

          return (
            <Pressable
              key={persona.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setActivePersonaId(persona.id)}
              style={[styles.personaCard, isSelected && styles.personaCardSelected]}
            >
              <Text style={styles.personaLabel}>{persona.label}</Text>
              <Text style={styles.personaDescription}>{persona.description}</Text>
              <Text style={styles.personaMeta}>
                Opens at: {persona.entryRoute.replace("-", " ")}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: startFromLogin }}
        onPress={() => setStartFromLogin((value) => !value)}
        style={styles.loginOverrideRow}
      >
        <Checkbox
          accessibilityLabel="Start from login"
          checked={startFromLogin}
          onPress={() => setStartFromLogin((value) => !value)}
        />
        <Text style={styles.loginOverrideLabel}>Start from login</Text>
      </Pressable>

      <View style={styles.actions}>
        <Button label="Launch persona" onPress={handleLaunch} />
        <Button label="Design System" variant="secondary" onPress={onOpenPlayground} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
  },
  scrollContent: {
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing["2xl"],
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.headingH1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  personaList: {
    gap: spacing.sm,
  },
  personaCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xxs,
    padding: spacing.md,
  },
  personaCardSelected: {
    borderColor: colors.border.focus,
    borderWidth: 2,
  },
  personaLabel: {
    ...typography.labelDefault,
    color: colors.text.primary,
  },
  personaDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  personaMeta: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "capitalize",
  },
  loginOverrideRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  loginOverrideLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  actions: {
    gap: spacing.sm,
  },
});
