import { useState } from "react";
import { Button, Stepper } from "@kaddie/ui";
import { StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function StepperPlayground({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <PlaygroundScreen title="Stepper" onBack={onBack}>
      <VariantRow label="Step 1">
        <Stepper currentStep={1} />
      </VariantRow>

      <VariantRow label="Step 2">
        <Stepper currentStep={2} />
      </VariantRow>

      <VariantRow label="Step 3">
        <Stepper currentStep={3} />
      </VariantRow>

      <VariantRow label="Interactive">
        <View style={styles.interactive}>
          <Stepper currentStep={currentStep} />
          <View style={styles.controls}>
            <Button
              label="Previous"
              size="sm"
              variant="secondary"
              disabled={currentStep <= 1}
              onPress={() => setCurrentStep((step) => Math.max(1, step - 1))}
            />
            <Button
              label="Next"
              size="sm"
              disabled={currentStep >= 3}
              onPress={() => setCurrentStep((step) => Math.min(3, step + 1))}
            />
          </View>
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  interactive: {
    gap: 16,
    alignItems: "flex-start",
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
});
