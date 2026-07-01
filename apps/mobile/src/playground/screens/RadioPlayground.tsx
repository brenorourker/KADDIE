import { useState } from "react";
import { Radio } from "@kaddie/ui";
import { StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function RadioPlayground({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(true);

  return (
    <PlaygroundScreen title="Radio" onBack={onBack}>
      <VariantRow label="Unselected">
        <Radio accessibilityLabel="Unselected option" />
      </VariantRow>

      <VariantRow label="Selected">
        <Radio
          accessibilityLabel="Selected option"
          selected
          onPress={() => setSelected(true)}
        />
      </VariantRow>

      <VariantRow label="Disabled">
        <Radio accessibilityLabel="Disabled option" disabled />
      </VariantRow>

      <VariantRow label="Interactive group">
        <View style={styles.group}>
          <Radio
            accessibilityLabel="Option A"
            selected={selected}
            onPress={() => setSelected(true)}
          />
          <Radio
            accessibilityLabel="Option B"
            selected={!selected}
            onPress={() => setSelected(false)}
          />
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    gap: 16,
  },
});
