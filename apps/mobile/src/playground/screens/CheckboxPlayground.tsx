import { useState } from "react";
import { Checkbox } from "@kaddie/ui";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function CheckboxPlayground({ onBack }: { onBack: () => void }) {
  const [checked, setChecked] = useState(true);

  return (
    <PlaygroundScreen title="Checkbox" onBack={onBack}>
      <VariantRow label="Unchecked">
        <Checkbox accessibilityLabel="Unchecked option" />
      </VariantRow>

      <VariantRow label="Checked">
        <Checkbox accessibilityLabel="Checked option" checked />
      </VariantRow>

      <VariantRow label="Indeterminate">
        <Checkbox accessibilityLabel="Indeterminate option" indeterminate />
      </VariantRow>

      <VariantRow label="Disabled">
        <Checkbox accessibilityLabel="Disabled option" disabled />
      </VariantRow>

      <VariantRow label="Interactive">
        <Checkbox
          accessibilityLabel="Toggle option"
          checked={checked}
          onPress={() => setChecked((value) => !value)}
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
