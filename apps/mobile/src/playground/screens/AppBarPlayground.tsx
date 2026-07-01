import { AppBar } from "@kaddie/ui";
import { Alert, StyleSheet, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const appBarMenuOptions = [
  {
    label: "Share",
    onPress: () => Alert.alert("App Bar", "Share selected"),
  },
  {
    label: "Settings",
    onPress: () => Alert.alert("App Bar", "Settings selected"),
  },
];

export function AppBarPlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="App Bar" onBack={onBack}>
      <VariantRow label="Default">
        <View style={styles.preview}>
          <AppBar
            title="Screen title"
            menuOptions={appBarMenuOptions}
            onLeadingPress={() => Alert.alert("App Bar", "Back tapped")}
          />
        </View>
      </VariantRow>

      <VariantRow label="With Action">
        <View style={styles.preview}>
          <AppBar
            title="Screen title"
            variant="with-action"
            menuOptions={appBarMenuOptions}
            onLeadingPress={() => Alert.alert("App Bar", "Back tapped")}
            onSecondTrailingPress={() =>
              Alert.alert("App Bar", "Second action tapped")
            }
          />
        </View>
      </VariantRow>

      <VariantRow label="Centered">
        <View style={styles.preview}>
          <AppBar
            title="Screen title"
            variant="centered"
            menuOptions={appBarMenuOptions}
            onLeadingPress={() => Alert.alert("App Bar", "Back tapped")}
          />
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    marginHorizontal: -16,
  },
});
