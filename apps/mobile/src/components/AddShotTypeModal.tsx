import { useEffect, useState } from "react";
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  colors,
  controlSize,
  Input,
  NumberStepper,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";

type AddShotTypeModalProps = {
  visible: boolean;
  defaultDistance: number;
  onCancel: () => void;
  onConfirm: (shotType: { label: string; distance: number }) => void;
};

export function AddShotTypeModal({
  visible,
  defaultDistance,
  onCancel,
  onConfirm,
}: AddShotTypeModalProps) {
  const [label, setLabel] = useState("");
  const [distance, setDistance] = useState(defaultDistance);

  useEffect(() => {
    if (visible) {
      setLabel("");
      setDistance(defaultDistance);
    }
  }, [visible, defaultDistance]);

  const trimmedLabel = label.trim();
  const canConfirm = trimmedLabel.length > 0;

  return (
    <RNModal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close add shot type"
          onPress={onCancel}
          style={styles.backdrop}
        />

        <View style={styles.centered}>
          <View style={styles.card}>
            <Text style={styles.title}>Add shot type</Text>

            <View style={styles.form}>
              <Input
                containerStyle={styles.field}
                label="Shot type"
                placeholder="Half-swing"
                value={label}
                onChangeText={setLabel}
              />

              <NumberStepper
                containerStyle={styles.field}
                label="Distance"
                max={400}
                min={10}
                step={1}
                value={distance}
                onValueChange={setDistance}
              />
            </View>

            <View style={styles.actions}>
              <Button
                label="Cancel"
                size="md"
                style={styles.actionButton}
                variant="secondary"
                onPress={onCancel}
              />
              <Button
                disabled={!canConfirm}
                label="Confirm"
                size="md"
                style={styles.actionButton}
                onPress={() =>
                  onConfirm({ label: trimmedLabel, distance })
                }
              />
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  centered: {
    width: "100%",
    maxWidth: controlSize.modalWidth,
    zIndex: 1,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderRadius: radii.xl,
    gap: spacing.md,
    overflow: "visible",
    padding: spacing.xl,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
    width: "100%",
  },
  title: {
    ...typography.headingH3,
    color: colors.text.primary,
    textAlign: "center",
    width: "100%",
  },
  form: {
    gap: spacing.md,
    width: "100%",
  },
  field: {
    maxWidth: "100%",
    width: "100%",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: "100%",
  },
  actionButton: {
    borderRadius: radii.lg,
    flex: 1,
    minWidth: 0,
  },
});
