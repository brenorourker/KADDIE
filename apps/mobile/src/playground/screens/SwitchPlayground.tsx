import { useState } from "react";
import { Switch } from "@kaddie/ui";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function SwitchPlayground({ onBack }: { onBack: () => void }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <PlaygroundScreen title="Switch" onBack={onBack}>
      <VariantRow label="Off">
        <Switch accessibilityLabel="Notifications off" />
      </VariantRow>

      <VariantRow label="On">
        <Switch accessibilityLabel="Notifications on" value />
      </VariantRow>

      <VariantRow label="Disabled">
        <Switch accessibilityLabel="Notifications disabled" disabled />
      </VariantRow>

      <VariantRow label="Interactive">
        <Switch
          accessibilityLabel="Toggle notifications"
          value={enabled}
          onValueChange={setEnabled}
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
