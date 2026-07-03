import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  colors,
  controlSize,
  Dropdown,
  Icon,
  iconSize,
  Input,
  NumberStepper,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { makeOptions } from "../personas/data/shared";
import { usePersona } from "../personas/PersonaProvider";
import { getClubDetails } from "../personas/utils";

type ClubDetailsScreenProps = {
  clubId: string;
  onBack: () => void;
  onDone: () => void;
};

export function ClubDetailsScreen({
  clubId,
  onBack,
  onDone,
}: ClubDetailsScreenProps) {
  const { clubDetails, updateClubDetails } = usePersona();
  const savedDetails = getClubDetails(clubDetails, clubId);
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  const [make, setMake] = useState(savedDetails.make);
  const [name, setName] = useState(savedDetails.name);
  const [distance, setDistance] = useState(savedDetails.distance);

  const isDirty = useMemo(
    () =>
      make !== savedDetails.make ||
      name !== savedDetails.name ||
      distance !== savedDetails.distance,
    [distance, make, name, savedDetails.distance, savedDetails.make, savedDetails.name],
  );

  const handleDone = () => {
    if (!isDirty) {
      return;
    }

    updateClubDetails(clubId, { make, name, distance });
    onDone();
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
          Club details
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
        <Text style={styles.intro}>{savedDetails.intro}</Text>

        <Dropdown
          containerStyle={styles.fullWidthField}
          label="Make"
          options={[...makeOptions]}
          value={make}
          visibleOptionCount={8}
          onValueChange={setMake}
        />

        <Input containerStyle={styles.fullWidthField} label="Name" value={name} onChangeText={setName} />

        <NumberStepper
          containerStyle={styles.fullWidthField}
          label="Distance"
          max={400}
          min={50}
          step={1}
          value={distance}
          onValueChange={setDistance}
        />

        <View style={styles.actionsSpacer} />

        <View style={styles.actionsRow}>
          <Button
            label="Retire club"
            size="lg"
            style={styles.actionButton}
            variant="secondary"
            onPress={() => Alert.alert("Retire club", "Not connected yet.")}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert("Delete club", "Not connected yet.")}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
          >
            <Text style={styles.deleteButtonLabel}>Delete club</Text>
          </Pressable>
        </View>
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
  fullWidthField: {
    maxWidth: "100%",
    width: "100%",
  },
  actionsSpacer: {
    height: spacing.xl,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    minWidth: 0,
  },
  deleteButton: {
    alignItems: "center",
    borderColor: colors.border.error,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    height: controlSize.lg,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: spacing.lg,
  },
  deleteButtonPressed: {
    backgroundColor: colors.feedback.errorBg,
  },
  deleteButtonLabel: {
    ...typography.buttonMd,
    color: colors.action.destructive,
  },
});
