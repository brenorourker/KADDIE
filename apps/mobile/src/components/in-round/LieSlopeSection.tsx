import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, controlSize, fontFamily, radii, spacing } from "@kaddie/ui";
import { useRoundMap } from "../../round/RoundMapProvider";
import type { LieOption, SlopeOption } from "../../round/types";
import { inRoundColors } from "../../round/inRoundTheme";

const lieOptions: ReadonlyArray<{ id: LieOption; label: string }> = [
  { id: "fairway", label: "Fairway" },
  { id: "light-rough", label: "Light rough" },
  { id: "heavy-rough", label: "Heavy rough" },
  { id: "divot", label: "Divot" },
  { id: "straw", label: "Straw" },
  { id: "sand", label: "Sand" },
];

const slopeOptions: ReadonlyArray<{ id: SlopeOption; label: string }> = [
  { id: "flat", label: "Flat" },
  { id: "above-feet", label: "Above feet" },
  { id: "below-feet", label: "Below feet" },
  { id: "up-slope", label: "Up slope" },
  { id: "down-slope", label: "Down slope" },
];

function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipOutlined]}
    >
      <Text style={[styles.chipLabel, selected ? styles.chipLabelSelected : styles.chipLabelOutlined]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function LieSlopeSection() {
  const { lie, slope, setLie, setSlope } = useRoundMap();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>LIE</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.chipRow}
        showsHorizontalScrollIndicator={false}
      >
        {lieOptions.map((option) => (
          <OptionChip
            key={option.id}
            label={option.label}
            selected={lie === option.id}
            onPress={() => setLie(option.id)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>SLOPE</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.chipRow}
        showsHorizontalScrollIndicator={false}
      >
        {slopeOptions.map((option) => (
          <OptionChip
            key={option.id}
            label={option.label}
            selected={slope === option.id}
            onPress={() => setSlope(option.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: inRoundColors.textInverse,
    paddingHorizontal: spacing.sm,
  },
  chipRow: {
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  chip: {
    height: controlSize.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: colors.action.primary,
  },
  chipOutlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  chipLabel: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.026,
  },
  chipLabelSelected: {
    color: colors.text.primary,
  },
  chipLabelOutlined: {
    color: inRoundColors.textInverse,
  },
});
