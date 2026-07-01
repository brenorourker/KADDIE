import { ActionTile } from "@kaddie/ui";
import { Alert, StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const SAMPLE = {
  title: "New project",
  subtitle: "Start from a template",
};

export function ActionTilePlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Action Tile" onBack={onBack}>
      <VariantRow label="Vertical">
        <ActionTile
          {...SAMPLE}
          layout="vertical"
          onPress={() => Alert.alert("Action Tile", "Vertical tile tapped")}
        />
      </VariantRow>

      <VariantRow label="Horizontal">
        <ActionTile
          {...SAMPLE}
          layout="horizontal"
          onPress={() => Alert.alert("Action Tile", "Horizontal tile tapped")}
        />
      </VariantRow>

      <VariantRow label="Horizontal — No chevron">
        <ActionTile
          {...SAMPLE}
          layout="horizontal"
          showChevron={false}
          onPress={() => Alert.alert("Action Tile", "Horizontal tile tapped")}
        />
      </VariantRow>

      <VariantRow label="Side by side">
        <View style={styles.row}>
          <ActionTile
            title="Import"
            subtitle="Bring in files"
            layout="vertical"
            onPress={() => Alert.alert("Action Tile", "Import tapped")}
          />
          <ActionTile
            title="Browse"
            subtitle="Explore templates"
            layout="vertical"
            onPress={() => Alert.alert("Action Tile", "Browse tapped")}
          />
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
