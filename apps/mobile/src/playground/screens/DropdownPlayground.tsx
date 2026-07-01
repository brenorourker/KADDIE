import { useState } from "react";
import { Dropdown } from "@kaddie/ui";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "Mexico", value: "mx" },
  { label: "United Kingdom", value: "uk" },
];

export function DropdownPlayground({ onBack }: { onBack: () => void }) {
  const [filledValue, setFilledValue] = useState("us");
  const [openValue, setOpenValue] = useState("us");

  return (
    <PlaygroundScreen title="Dropdown" onBack={onBack}>
      <VariantRow label="Default">
        <Dropdown label="Country" options={countryOptions} helperText="Helper text" />
      </VariantRow>

      <VariantRow label="Filled">
        <Dropdown
          label="Country"
          options={countryOptions}
          value={filledValue}
          onValueChange={setFilledValue}
          helperText="Helper text"
        />
      </VariantRow>

      <VariantRow label="Open">
        <Dropdown
          label="Country"
          options={countryOptions}
          value={openValue}
          onValueChange={setOpenValue}
          open
          helperText="Helper text"
        />
      </VariantRow>

      <VariantRow label="Error">
        <Dropdown
          label="Country"
          options={countryOptions}
          value="invalid"
          error="Please select a country."
        />
      </VariantRow>

      <VariantRow label="Disabled">
        <Dropdown
          label="Country"
          options={countryOptions}
          helperText="Helper text"
          disabled
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
