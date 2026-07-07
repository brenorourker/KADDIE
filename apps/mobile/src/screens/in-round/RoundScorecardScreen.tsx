import { StyleSheet, View } from "react-native";
import { inRoundColors } from "../../round/inRoundTheme";

export function RoundScorecardScreen() {
  return <View style={styles.root} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: inRoundColors.background,
  },
});
