import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Modal, spacing, typography } from "@kaddie/ui";
import { useRoundMap } from "../../round/RoundMapProvider";
import { inRoundColors } from "../../round/inRoundTheme";
import { getCourseLabel } from "../roundConfig";

type RoundMenuScreenProps = {
  onEndRound: () => void;
};

export function RoundMenuScreen({ onEndRound }: RoundMenuScreenProps) {
  const { config } = useRoundMap();
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>ROUND</Text>
        <Text style={styles.courseName}>{getCourseLabel(config.course)}</Text>

        <Button
          label="End round"
          size="md"
          style={styles.endRoundButton}
          variant="secondary"
          onPress={() => setConfirmVisible(true)}
        />
      </View>

      <Modal
        body="Are you sure you want to end this round?"
        cancelLabel="Cancel"
        confirmLabel="End round"
        title="End round"
        visible={confirmVisible}
        onCancelPress={() => setConfirmVisible(false)}
        onConfirmPress={() => {
          setConfirmVisible(false);
          onEndRound();
        }}
        onRequestClose={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: inRoundColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["2xl"],
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.overline,
    color: inRoundColors.textInverse,
    opacity: 0.7,
  },
  courseName: {
    ...typography.headingH3,
    color: inRoundColors.textInverse,
    marginBottom: spacing.xl,
  },
  endRoundButton: {
    alignSelf: "flex-start",
  },
});
