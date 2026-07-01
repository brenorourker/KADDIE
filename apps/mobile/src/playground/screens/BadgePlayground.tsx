import { Badge } from "@kaddie/ui";
import { StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

export function BadgePlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Badge" onBack={onBack}>
      <VariantRow label="Dot">
        <View style={styles.row}>
          <Badge type="dot" color="brand" />
          <Badge type="dot" color="error" />
        </View>
      </VariantRow>

      <VariantRow label="Count">
        <View style={styles.row}>
          <Badge type="count" color="brand" count={3} />
          <Badge type="count" color="error" count={3} />
        </View>
      </VariantRow>

      <VariantRow label="Status">
        <View style={styles.statusGroup}>
          <Badge type="status" color="brand" />
          <Badge type="status" color="error" />
          <Badge type="status" color="warning" />
          <Badge type="status" color="info" />
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
});
