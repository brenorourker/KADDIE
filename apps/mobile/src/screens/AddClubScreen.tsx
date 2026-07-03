import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Accordion,
  Button,
  Checkbox,
  colors,
  controlSize,
  Icon,
  iconSize,
  spacing,
  typography,
} from "@kaddie/ui";
import { usePersona } from "../personas/PersonaProvider";
import {
  countSelectedClubs,
  selectionSignature,
} from "../personas/utils";
import type { AddClubOption } from "../personas/types";

type AddClubScreenProps = {
  onBack: () => void;
  onDone: () => void;
};

type ClubCheckboxRowProps = {
  club: AddClubOption;
  checked: boolean;
  onToggle: () => void;
};

function ClubCheckboxRow({ club, checked, onToggle }: ClubCheckboxRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={styles.checkboxRow}
    >
      <Checkbox
        accessibilityLabel={club.label}
        checked={checked}
        onPress={onToggle}
      />
      <Text style={styles.checkboxLabel}>{club.label}</Text>
    </Pressable>
  );
}

export function AddClubScreen({ onBack, onDone }: AddClubScreenProps) {
  const { activePersona, clubSelection, setClubSelection } = usePersona();
  const addClubData = activePersona.data.addClub;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const savedSignature = useMemo(
    () => selectionSignature(clubSelection),
    [clubSelection],
  );

  const [selectedClubs, setSelectedClubs] = useState(clubSelection);

  const selectedCount = useMemo(
    () => countSelectedClubs(selectedClubs),
    [selectedClubs],
  );

  const isDirty = selectionSignature(selectedClubs) !== savedSignature;

  const handleDone = () => {
    setClubSelection(selectedClubs);
    onDone();
  };

  const toggleClub = (clubId: string) => {
    setSelectedClubs((current) => ({
      ...current,
      [clubId]: !current[clubId],
    }));
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerBar}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.headerIconButton}
        >
          <Icon color={colors.text.primary} name="chevron-left" size={iconSize.lg} />
        </Pressable>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Add a club
        </Text>

        <Button
          disabled={!isDirty}
          label="Done"
          size="sm"
          onPress={handleDone}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <Text style={styles.intro}>
          You have selected {selectedCount}{" "}
          {selectedCount === 1 ? "club" : "clubs"}.
        </Text>

        {addClubData.categories.map((category) => (
          <Accordion key={category.id} title={category.title}>
            <View style={styles.accordionContent}>
              {category.clubs.map((club) => (
                <ClubCheckboxRow
                  key={club.id}
                  checked={Boolean(selectedClubs[club.id])}
                  club={club}
                  onToggle={() => toggleClub(club.id)}
                />
              ))}
            </View>
          </Accordion>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
  },
  headerBar: {
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: controlSize.appBar,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerIconButton: {
    alignItems: "center",
    height: controlSize.md,
    justifyContent: "center",
    width: controlSize.md,
  },
  headerTitle: {
    ...typography.headingH3,
    color: colors.text.primary,
    flex: 1,
    minWidth: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  intro: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  accordionContent: {
    gap: spacing.md,
  },
  checkboxRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 24,
  },
  checkboxLabel: {
    ...typography.bodyDefault,
    color: colors.text.primary,
    flex: 1,
  },
});
