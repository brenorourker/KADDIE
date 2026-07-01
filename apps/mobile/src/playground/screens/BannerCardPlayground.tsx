import { BannerCard } from "@kaddie/ui";
import { Alert } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const SAMPLE = {
  title: "Heading",
  body: "Unlock unlimited projects, advanced exports, and priority support.",
};

export function BannerCardPlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Banner Card" onBack={onBack}>
      <VariantRow label="Promo">
        <BannerCard
          {...SAMPLE}
          style="promo"
          onActionPress={() => Alert.alert("Banner Card", "Upgrade tapped")}
          onDismissPress={() => Alert.alert("Banner Card", "Dismissed")}
        />
      </VariantRow>

      <VariantRow label="Info">
        <BannerCard
          {...SAMPLE}
          style="info"
          onActionPress={() => Alert.alert("Banner Card", "Upgrade tapped")}
          onDismissPress={() => Alert.alert("Banner Card", "Dismissed")}
        />
      </VariantRow>

      <VariantRow label="Subtle">
        <BannerCard
          {...SAMPLE}
          style="subtle"
          onActionPress={() => Alert.alert("Banner Card", "Upgrade tapped")}
          onDismissPress={() => Alert.alert("Banner Card", "Dismissed")}
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
