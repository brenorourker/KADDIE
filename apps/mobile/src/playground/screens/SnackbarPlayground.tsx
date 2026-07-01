import { Snackbar } from "@kaddie/ui";
import { Alert } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const snackbarMenuOptions = [
  {
    label: "Learn more",
    onPress: () => Alert.alert("Snackbar", "Learn more selected"),
  },
  {
    label: "Dismiss",
    onPress: () => Alert.alert("Snackbar", "Dismissed"),
  },
];

export function SnackbarPlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Snackbar" onBack={onBack}>
      <VariantRow label="Info">
        <Snackbar variant="info" message="Tap to learn more" />
      </VariantRow>

      <VariantRow label="Success">
        <Snackbar variant="success" message="Tap to learn more" />
      </VariantRow>

      <VariantRow label="Warning">
        <Snackbar variant="warning" message="Tap to learn more" />
      </VariantRow>

      <VariantRow label="Error">
        <Snackbar variant="error" message="Tap to learn more" />
      </VariantRow>

      <VariantRow label="With menu">
        <Snackbar
          variant="info"
          message="Tap to learn more"
          menuOptions={snackbarMenuOptions}
        />
      </VariantRow>

      <VariantRow label="Interactive">
        <Snackbar
          variant="info"
          message="Tap to learn more"
          menuOptions={snackbarMenuOptions}
          onPress={() => Alert.alert("Snackbar", "Message tapped")}
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}
