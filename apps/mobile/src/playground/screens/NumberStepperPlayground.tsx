import { useState } from "react";
import { NumberStepper } from "@kaddie/ui";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function NumberStepperPlayground({ onBack }: { onBack: () => void }) {
  const [filledValue, setFilledValue] = useState(5);
  const [focusValue, setFocusValue] = useState(2);

  return (
    <PlaygroundScreen title="Number Stepper" onBack={onBack}>
      <VariantRow label="Default">
        <NumberStepper label="Quantity" helperText="Helper text" />
      </VariantRow>

      <VariantRow label="Focus">
        <NumberStepper
          label="Quantity"
          helperText="Helper text"
          previewFocused
          value={focusValue}
          onValueChange={setFocusValue}
        />
      </VariantRow>

      <VariantRow label="Filled">
        <NumberStepper
          label="Quantity"
          helperText="Helper text"
          value={filledValue}
          onValueChange={setFilledValue}
        />
      </VariantRow>

      <VariantRow label="Error">
        <NumberStepper
          label="Quantity"
          value={0}
          min={1}
          error="Value must be at least 1."
        />
      </VariantRow>

      <VariantRow label="Disabled">
        <NumberStepper
          label="Quantity"
          helperText="Helper text"
          disabled
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
