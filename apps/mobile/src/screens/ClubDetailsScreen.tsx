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
  Modal,
  NumberStepper,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { AddShotTypeModal } from "../components/AddShotTypeModal";
import { makeOptions } from "../personas/data/shared";
import { usePersona } from "../personas/PersonaProvider";
import type { ClubShotType } from "../personas/types";
import { getClubDetails } from "../personas/utils";

type ClubDetailsScreenProps = {
  clubId: string;
  onBack: () => void;
  onDone: () => void;
};

function shotTypesEqual(a: ClubShotType[], b: ClubShotType[]) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every(
    (shot, index) =>
      shot.id === b[index]?.id &&
      shot.label === b[index]?.label &&
      shot.distance === b[index]?.distance,
  );
}

export function ClubDetailsScreen({
  clubId,
  onBack,
  onDone,
}: ClubDetailsScreenProps) {
  const { bagData, clubDetails, removeClubFromBag, updateClubDetails } = usePersona();
  const savedDetails = getClubDetails(clubDetails, clubId);
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  const [make, setMake] = useState(savedDetails.make);
  const [name, setName] = useState(savedDetails.name);
  const [distance, setDistance] = useState(savedDetails.distance);
  const [shotTypes, setShotTypes] = useState<ClubShotType[]>(
    () => savedDetails.shotTypes ?? [],
  );
  const [addShotVisible, setAddShotVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const clubTitle = useMemo(() => {
    for (const section of bagData.sections) {
      const club = section.clubs.find((item) => item.id === clubId);

      if (club) {
        return club.title;
      }
    }

    return "this club";
  }, [bagData.sections, clubId]);

  const isDirty = useMemo(
    () =>
      make !== savedDetails.make ||
      name !== savedDetails.name ||
      distance !== savedDetails.distance ||
      !shotTypesEqual(shotTypes, savedDetails.shotTypes ?? []),
    [
      distance,
      make,
      name,
      savedDetails.distance,
      savedDetails.make,
      savedDetails.name,
      savedDetails.shotTypes,
      shotTypes,
    ],
  );

  const handleDone = () => {
    if (!isDirty) {
      return;
    }

    updateClubDetails(clubId, { make, name, distance, shotTypes });
    onDone();
  };

  const handleDeleteConfirm = () => {
    removeClubFromBag(clubId);
    setDeleteModalVisible(false);
    onDone();
  };

  const handleAddShotType = (shot: { label: string; distance: number }) => {
    setShotTypes((current) => [
      ...current,
      {
        id: `shot-${Date.now()}-${current.length}`,
        label: shot.label,
        distance: shot.distance,
      },
    ]);
    setAddShotVisible(false);
  };

  const handleShotDistanceChange = (shotId: string, nextDistance: number) => {
    setShotTypes((current) =>
      current.map((shot) =>
        shot.id === shotId ? { ...shot, distance: nextDistance } : shot,
      ),
    );
  };

  const handleRemoveShotType = (shotId: string) => {
    setShotTypes((current) => current.filter((shot) => shot.id !== shotId));
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
          {clubTitle === "this club" ? "Club details" : clubTitle}
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

        <View style={styles.distanceRow}>
          <NumberStepper
            containerStyle={styles.distanceField}
            label="Standard swing"
            max={400}
            min={50}
            step={1}
            value={distance}
            onValueChange={setDistance}
          />
          <Button
            accessibilityLabel="Add shot type"
            iconOnly
            label="Add shot type"
            leadingIcon={
              <Icon
                color={colors.action.onPrimary}
                name="plus"
                size={iconSize.md}
              />
            }
            size="md"
            style={styles.addShotButton}
            onPress={() => setAddShotVisible(true)}
          />
        </View>

        {shotTypes.map((shot) => (
          <View key={shot.id} style={styles.distanceRow}>
            <NumberStepper
              containerStyle={styles.distanceField}
              label={shot.label}
              max={400}
              min={10}
              step={1}
              value={shot.distance}
              onValueChange={(next) => handleShotDistanceChange(shot.id, next)}
            />
            <Pressable
              accessibilityLabel={`Delete ${shot.label}`}
              accessibilityRole="button"
              hitSlop={4}
              onPress={() => handleRemoveShotType(shot.id)}
              style={({ pressed }) => [
                styles.deleteShotButton,
                pressed && styles.deleteShotButtonPressed,
              ]}
            >
              <Icon
                color={colors.action.destructive}
                name="close"
                size={iconSize.md}
              />
            </Pressable>
          </View>
        ))}

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
            onPress={() => setDeleteModalVisible(true)}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
          >
            <Text style={styles.deleteButtonLabel}>Delete club</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AddShotTypeModal
        defaultDistance={distance}
        visible={addShotVisible}
        onCancel={() => setAddShotVisible(false)}
        onConfirm={handleAddShotType}
      />

      <Modal
        body={`Are you sure you want to delete ${clubTitle} from your bag? This can't be undone.`}
        cancelLabel="Cancel"
        confirmLabel="Delete club"
        icon={
          <Icon color={colors.action.destructive} name="close" size={iconSize.lg} />
        }
        title="Delete club?"
        visible={deleteModalVisible}
        onCancelPress={() => setDeleteModalVisible(false)}
        onConfirmPress={handleDeleteConfirm}
        onRequestClose={() => setDeleteModalVisible(false)}
      />
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
  distanceRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },
  distanceField: {
    flex: 1,
    maxWidth: "100%",
  },
  addShotButton: {
    borderRadius: radii.lg,
    marginBottom: 0,
    minWidth: controlSize.md,
    width: controlSize.md,
  },
  deleteShotButton: {
    alignItems: "center",
    borderColor: colors.border.error,
    borderRadius: radii.lg,
    borderWidth: 1,
    height: controlSize.md,
    justifyContent: "center",
    width: controlSize.md,
  },
  deleteShotButtonPressed: {
    backgroundColor: colors.feedback.errorBg,
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
