import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, fontFamily, Icon, radii, spacing } from "@kaddie/ui";
import { inRoundColors } from "../../round/inRoundTheme";

export const SHOT_MIN = 1;
export const SHOT_MAX = 99;

export function formatShotNumber(value: number) {
  return String(value).padStart(2, "0");
}

type ShotNumberStepperProps = {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  /** Field width; map chrome uses 120, scorecard uses 226. */
  width?: number;
  /** Centre the “Add shot” label over the stepper (scorecard). */
  centerLabel?: boolean;
  style?: ViewStyle;
};

export function ShotNumberStepper({
  value,
  onDecrement,
  onIncrement,
  width = 120,
  centerLabel = false,
  style,
}: ShotNumberStepperProps) {
  const canDecrement = value > SHOT_MIN;
  const canIncrement = value < SHOT_MAX;

  return (
    <View style={[styles.shotStepper, { width }, style]}>
      <Text
        style={[styles.shotLabel, centerLabel && styles.shotLabelCentered]}
      >
        Add shot
      </Text>
      <View
        accessibilityLabel="Add shot"
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: SHOT_MIN,
          max: SHOT_MAX,
          now: value,
          text: formatShotNumber(value),
        }}
        style={styles.shotField}
      >
        <Pressable
          accessibilityLabel="Decrease shot number"
          accessibilityRole="button"
          disabled={!canDecrement}
          hitSlop={4}
          onPress={onDecrement}
          style={({ pressed }) => [
            styles.shotStepButton,
            pressed && canDecrement && styles.shotStepButtonPressed,
          ]}
        >
          <Icon
            name="minus"
            size={24}
            color={
              canDecrement
                ? inRoundColors.textInverse
                : colors.action.onDisabled
            }
          />
        </Pressable>
        <Text style={styles.shotValue}>{formatShotNumber(value)}</Text>
        <Pressable
          accessibilityLabel="Increase shot number"
          accessibilityRole="button"
          disabled={!canIncrement}
          hitSlop={4}
          onPress={onIncrement}
          style={({ pressed }) => [
            styles.shotStepButton,
            pressed && canIncrement && styles.shotStepButtonPressed,
          ]}
        >
          <Icon
            name="plus"
            size={24}
            color={
              canIncrement
                ? inRoundColors.textInverse
                : colors.action.onDisabled
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shotStepper: {
    gap: spacing.xxs,
  },
  shotLabel: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.028,
    color: inRoundColors.textInverse,
  },
  shotLabelCentered: {
    textAlign: "center",
    width: "100%",
  },
  shotField: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.sm,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  shotStepButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shotStepButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  shotValue: {
    flex: 1,
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 16,
    lineHeight: 24,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
});
