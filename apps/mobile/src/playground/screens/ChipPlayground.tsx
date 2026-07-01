import { useState } from "react";
import { Chip } from "@kaddie/ui";
import { StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function ChipPlayground({ onBack }: { onBack: () => void }) {
  const [filledSelected, setFilledSelected] = useState(false);
  const [outlinedSelected, setOutlinedSelected] = useState(false);

  return (
    <PlaygroundScreen title="Chip" onBack={onBack}>
      <VariantRow label="Filled — Default">
        <Chip label="Label" />
      </VariantRow>

      <VariantRow label="Filled — Selected">
        <Chip label="Selected" selected />
      </VariantRow>

      <VariantRow label="Filled — Disabled">
        <Chip label="Disabled" disabled />
      </VariantRow>

      <VariantRow label="Outlined — Default">
        <Chip label="Label" variant="outlined" />
      </VariantRow>

      <VariantRow label="Outlined — Selected">
        <Chip label="Selected" variant="outlined" selected />
      </VariantRow>

      <VariantRow label="Outlined — Disabled">
        <Chip label="Disabled" variant="outlined" disabled />
      </VariantRow>

      <VariantRow label="Interactive — Filled">
        <View style={styles.group}>
          <Chip
            label="Option A"
            selected={filledSelected}
            onPress={() => setFilledSelected(true)}
          />
          <Chip
            label="Option B"
            selected={!filledSelected}
            onPress={() => setFilledSelected(false)}
          />
        </View>
      </VariantRow>

      <VariantRow label="Interactive — Outlined">
        <View style={styles.group}>
          <Chip
            label="Option A"
            variant="outlined"
            selected={outlinedSelected}
            onPress={() => setOutlinedSelected(true)}
          />
          <Chip
            label="Option B"
            variant="outlined"
            selected={!outlinedSelected}
            onPress={() => setOutlinedSelected(false)}
          />
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
