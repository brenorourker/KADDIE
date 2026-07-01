import { useState } from "react";
import { Button, Modal } from "@kaddie/ui";
import { Alert, StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function ModalPlayground({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <PlaygroundScreen title="Modal" onBack={onBack}>
      <VariantRow label="Default">
        <View style={styles.preview}>
          <Modal />
        </View>
      </VariantRow>

      <VariantRow label="Interactive">
        <Button label="Open modal" onPress={() => setOpen(true)} />
        <Modal
          visible={open}
          onRequestClose={() => setOpen(false)}
          onCancelPress={() => setOpen(false)}
          onConfirmPress={() => {
            setOpen(false);
            Alert.alert("Modal", "Confirmed");
          }}
        />
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    alignItems: "center",
  },
});
