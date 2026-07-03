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
  Dropdown,
  Icon,
  iconSize,
  Input,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import {
  courseOptions,
  defaultRoundConfig,
  formatOptions,
  teeOptions,
  type RoundConfig,
} from "../screens/roundConfig";

type ConfigureRoundModalProps = {
  visible: boolean;
  initialValues?: RoundConfig;
  onCancel: () => void;
  onDone: (config: RoundConfig) => void;
};

export function ConfigureRoundModal({
  visible,
  initialValues = defaultRoundConfig,
  onCancel,
  onDone,
}: ConfigureRoundModalProps) {
  const [course, setCourse] = useState(initialValues.course);
  const [format, setFormat] = useState(initialValues.format);
  const [tees, setTees] = useState(initialValues.tees ?? defaultRoundConfig.tees);
  const [golfers, setGolfers] = useState(initialValues.golfers);

  useEffect(() => {
    if (visible) {
      setCourse(initialValues.course);
      setFormat(initialValues.format);
      setTees(initialValues.tees ?? defaultRoundConfig.tees);
      setGolfers(initialValues.golfers);
    }
  }, [visible, initialValues]);

  const handleDone = () => {
    onDone({
      name: initialValues.name,
      course,
      format,
      tees,
      golfers,
    });
  };

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
          accessibilityLabel="Close configure round"
          onPress={onCancel}
          style={styles.backdrop}
        />

        <View style={styles.centered}>
          <View style={styles.card}>
            <Text style={styles.title}>Configure round</Text>

            <View style={styles.form}>
              <Dropdown
                containerStyle={styles.field}
                label="Course"
                options={[...courseOptions]}
                value={course}
                onValueChange={setCourse}
              />

              <Dropdown
                containerStyle={styles.field}
                label="Tees"
                options={[...teeOptions]}
                value={tees}
                onValueChange={setTees}
              />

              <Dropdown
                containerStyle={styles.field}
                label="Format"
                options={[...formatOptions]}
                value={format}
                onValueChange={setFormat}
              />

              <View style={styles.golfersRow}>
                <Input
                  containerStyle={styles.golfersField}
                  label="Golfers"
                  labelStyle={styles.fieldLabel}
                  value={golfers}
                  onChangeText={setGolfers}
                />
                <Button
                  accessibilityLabel="Add golfer"
                  iconOnly
                  label="Add golfer"
                  leadingIcon={
                    <Icon
                      color={colors.action.onPrimary}
                      name="plus"
                      size={iconSize.md}
                    />
                  }
                  size="md"
                  style={styles.addGolferButton}
                  onPress={() => {
                    // Placeholder until multi-golfer flow is built.
                  }}
                />
              </View>
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
                label="Done"
                size="md"
                style={styles.actionButton}
                onPress={handleDone}
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
    overflow: "visible",
    position: "relative",
    width: "100%",
    zIndex: 2,
  },
  field: {
    maxWidth: "100%",
    width: "100%",
  },
  fieldLabel: {
    color: colors.text.primary,
  },
  golfersRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },
  golfersField: {
    flex: 1,
    maxWidth: "100%",
  },
  addGolferButton: {
    borderRadius: radii.lg,
    marginBottom: 0,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: 48,
    position: "relative",
    width: "100%",
    zIndex: 1,
  },
  actionButton: {
    borderRadius: radii.lg,
    flex: 1,
    minWidth: 0,
  },
});
