import { MediaCard } from "@kaddie/ui";
import { Alert } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const SAMPLE = {
  title: "Designing for clarity",
  body: "A practical guide to building interfaces that feel inevitable.",
};

export function MediaCardPlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Media Card" onBack={onBack}>
      <VariantRow label="Two Buttons">
        <MediaCard
          {...SAMPLE}
          actions="two-buttons"
          onPrimaryActionPress={() => Alert.alert("Media Card", "Read tapped")}
          onSecondaryActionPress={() => Alert.alert("Media Card", "Share tapped")}
        />
      </VariantRow>

      <VariantRow label="One Button">
        <MediaCard
          {...SAMPLE}
          actions="one-button"
          onPrimaryActionPress={() => Alert.alert("Media Card", "Read tapped")}
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
