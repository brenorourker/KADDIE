import { useState } from "react";
import { Input } from "@kaddie/ui";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function InputPlayground({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("hello@example.com");
  const [typing, setTyping] = useState("");

  return (
    <PlaygroundScreen title="Input" onBack={onBack}>
      <VariantRow label="Default">
        <Input label="Email" helperText="Helper text" />
      </VariantRow>

      <VariantRow label="Focus">
        <Input
          label="Email"
          helperText="Helper text"
          previewFocused
          value={typing}
          onChangeText={setTyping}
          placeholder="Typing…"
        />
      </VariantRow>

      <VariantRow label="Filled">
        <Input
          label="Email"
          helperText="Helper text"
          value={email}
          onChangeText={setEmail}
        />
      </VariantRow>

      <VariantRow label="Error">
        <Input
          label="Email"
          value="invalid"
          error="Please enter a valid email."
        />
      </VariantRow>

      <VariantRow label="Disabled">
        <Input
          label="Email"
          helperText="Helper text"
          disabled
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
