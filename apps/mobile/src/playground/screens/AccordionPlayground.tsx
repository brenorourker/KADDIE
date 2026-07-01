import { useState } from "react";
import { Accordion } from "@kaddie/ui";
import { StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function AccordionPlayground({ onBack }: { onBack: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(true);

  return (
    <PlaygroundScreen title="Accordion" onBack={onBack}>
      <VariantRow label="Closed">
        <Accordion title="Notifications" />
      </VariantRow>

      <VariantRow label="Open — empty placeholder">
        <Accordion defaultExpanded title="Preferences" />
      </VariantRow>

      <VariantRow label="Interactive group">
        <View style={styles.group}>
          <Accordion
            expanded={notificationsOpen}
            onExpandedChange={setNotificationsOpen}
            title="Notifications"
          />
          <Accordion
            expanded={preferencesOpen}
            onExpandedChange={setPreferencesOpen}
            title="Preferences"
          />
          <Accordion title="Delivery" />
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
    alignSelf: "stretch",
  },
});
