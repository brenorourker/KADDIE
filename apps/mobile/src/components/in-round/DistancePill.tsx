import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { fontFamily } from "@kaddie/ui";
import type { DistancePillVariant } from "../../round/types";

type DistancePillProps = {
  label: string;
  variant?: DistancePillVariant;
  style?: ViewStyle;
};

const variantStyles: Record<
  DistancePillVariant,
  { backgroundColor: string; color: string }
> = {
  primary: { backgroundColor: "#FFFFFF", color: "#000000" },
  secondary: { backgroundColor: "#ECCBA4", color: "#000000" },
  hazard: { backgroundColor: "#DC2626", color: "#FFFFFF" },
  dark: { backgroundColor: "#0F172A", color: "#FFFFFF" },
  information: { backgroundColor: "#0F172A", color: "#FFFFFF" },
};

export function DistancePill({ label, variant = "primary", style }: DistancePillProps) {
  const colors = variantStyles[variant];

  return (
    <View style={[styles.pill, { backgroundColor: colors.backgroundColor }, style]}>
      <Text style={[styles.label, { color: colors.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 9,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 8,
  },
  label: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.02,
    textAlign: "center",
  },
});
