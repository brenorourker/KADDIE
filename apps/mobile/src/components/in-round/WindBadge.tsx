import { StyleSheet, Text, View } from "react-native";
import { Icon, fontFamily, iconSize, radii } from "@kaddie/ui";
import { inRoundColors } from "../../round/inRoundTheme";

type WindBadgeProps = {
  speedKph: number;
};

export function WindBadge({ speedKph }: WindBadgeProps) {
  return (
    <View style={styles.container}>
      <Icon color={inRoundColors.textInverse} name="wind" size={iconSize.md} />
      <Text style={styles.label}>{speedKph} kph</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: "38%",
    width: 42,
    height: 74,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderTopLeftRadius: radii.sm,
    borderBottomLeftRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  label: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.044,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
});
