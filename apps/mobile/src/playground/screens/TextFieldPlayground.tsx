import { useState } from "react";
import { TextField } from "@kaddie/ui";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function TextFieldPlayground({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState(
    "Thanks for reaching out! I'll get back to you soon."
  );
  const [typing, setTyping] = useState("");

  return (
    <PlaygroundScreen title="Text Field" onBack={onBack}>
      <VariantRow label="Default">
        <TextField label="Message" helperText="Helper text" />
      </VariantRow>

      <VariantRow label="Focus">
        <TextField
          label="Message"
          helperText="Helper text"
          previewFocused
          value={typing}
          onChangeText={setTyping}
          placeholder="Typing…"
        />
      </VariantRow>

      <VariantRow label="Filled">
        <TextField
          label="Message"
          helperText="Helper text"
          value={message}
          onChangeText={setMessage}
        />
      </VariantRow>

      <VariantRow label="Error">
        <TextField
          label="Message"
          value="Hi"
          error="Please enter at least 20 characters."
        />
      </VariantRow>

      <VariantRow label="Disabled">
        <TextField
          label="Message"
          helperText="Helper text"
          disabled
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
