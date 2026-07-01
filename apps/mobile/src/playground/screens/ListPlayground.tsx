import { useState } from "react";
import { List, ListItem } from "@kaddie/ui";
import { StyleSheet } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function ListPlayground({ onBack }: { onBack: () => void }) {
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <PlaygroundScreen title="List" onBack={onBack}>
      <VariantRow label="Single-line with chevron">
        <List style={styles.list}>
          <ListItem
            onPress={() => undefined}
            title="List item title"
            trailing="chevron"
          />
        </List>
      </VariantRow>

      <VariantRow label="Two-line with chevron">
        <List style={styles.list}>
          <ListItem
            onPress={() => undefined}
            supportingText="Supporting text"
            title="List item title"
            trailing="chevron"
          />
        </List>
      </VariantRow>

      <VariantRow label="Avatar + two-line with chevron">
        <List style={styles.list}>
          <ListItem
            avatarInitials="AB"
            onPress={() => undefined}
            supportingText="Supporting text"
            title="List item title"
            trailing="chevron"
          />
        </List>
      </VariantRow>

      <VariantRow label="Avatar + two-line with switch">
        <List style={styles.list}>
          <ListItem
            avatarInitials="AB"
            onSwitchValueChange={setSwitchOn}
            supportingText="Supporting text"
            switchValue={switchOn}
            title="List item title"
            trailing="switch"
          />
        </List>
      </VariantRow>

      <VariantRow label="Grouped list">
        <List style={styles.list}>
          <ListItem
            onPress={() => undefined}
            title="List item title"
            trailing="chevron"
          />
          <ListItem
            onPress={() => undefined}
            supportingText="Supporting text"
            title="List item title"
            trailing="chevron"
          />
          <ListItem
            avatarInitials="AB"
            onPress={() => undefined}
            supportingText="Supporting text"
            title="List item title"
            trailing="chevron"
          />
          <ListItem
            avatarInitials="AB"
            onSwitchValueChange={setSwitchOn}
            supportingText="Supporting text"
            switchValue={switchOn}
            title="List item title"
            trailing="switch"
          />
        </List>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
