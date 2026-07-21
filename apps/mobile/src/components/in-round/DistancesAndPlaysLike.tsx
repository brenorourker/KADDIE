import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, fontFamily, spacing } from "@kaddie/ui";
import { inRoundColors } from "../../round/inRoundTheme";

type DistancesAndPlaysLikeProps = {
  back: number;
  middle: number;
  front: number;
  playsLikeYards: number;
  club: string;
  /** `compact` for map sheet; `scorecard` for larger centered layout. */
  variant?: "compact" | "scorecard";
  style?: ViewStyle;
};

export function DistancesAndPlaysLike({
  back,
  middle,
  front,
  playsLikeYards,
  club,
  variant = "compact",
  style,
}: DistancesAndPlaysLikeProps) {
  const isScorecard = variant === "scorecard";

  return (
    <View style={[styles.cluster, style]}>
      <View style={[styles.rows, isScorecard && styles.rowsScorecard]}>
        <View
          style={[styles.pinLine, isScorecard && styles.pinLineScorecard]}
          accessibilityElementsHidden
        />

        <View style={styles.row}>
          <Text
            style={[
              styles.outerValue,
              isScorecard && styles.outerValueScorecard,
              styles.yardsCol,
              isScorecard && styles.yardsColScorecard,
            ]}
          >
            {back}
          </Text>
          <View style={[styles.pinSlot, styles.pinSlotTop, isScorecard && styles.pinSlotScorecard]}>
            <View style={[styles.pinDotOuter, isScorecard && styles.pinDotOuterScorecard]} />
          </View>
          <Text
            style={[
              styles.playsLikeLabel,
              isScorecard && styles.playsLikeLabelScorecard,
              styles.playsCol,
            ]}
          >
            Plays like
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.middleValue,
              isScorecard && styles.middleValueScorecard,
              styles.yardsCol,
              isScorecard && styles.yardsColScorecard,
            ]}
          >
            {middle}
          </Text>
          <View style={[styles.pinSlot, isScorecard && styles.pinSlotMiddleScorecard]}>
            <View style={[styles.pinDotMiddle, isScorecard && styles.pinDotMiddleScorecard]} />
          </View>
          <Text
            style={[
              styles.playsLikeValue,
              isScorecard && styles.playsLikeValueScorecard,
              styles.playsCol,
            ]}
          >
            {playsLikeYards}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.outerValue,
              isScorecard && styles.outerValueScorecard,
              styles.yardsCol,
              isScorecard && styles.yardsColScorecard,
            ]}
          >
            {front}
          </Text>
          <View style={[styles.pinSlot, styles.pinSlotBottom, isScorecard && styles.pinSlotScorecard]}>
            <View style={[styles.pinDotOuter, isScorecard && styles.pinDotOuterScorecard]} />
          </View>
          <Text
            style={[
              styles.playsLikeClub,
              isScorecard && styles.playsLikeClubScorecard,
              styles.playsCol,
            ]}
          >
            {club}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {},
  rows: {
    position: "relative",
    gap: 8,
  },
  rowsScorecard: {
    gap: 12,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  yardsCol: {
    width: 42,
  },
  yardsColScorecard: {
    width: 72,
    textAlign: "right",
  },
  pinSlot: {
    width: 8,
    height: 8,
    marginLeft: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  pinSlotScorecard: {
    // Same column width for all three dots so centres share the pin line.
    width: 16,
    height: 16,
    marginLeft: spacing.sm,
  },
  pinSlotMiddleScorecard: {
    width: 16,
    height: 16,
    marginLeft: spacing.sm,
  },
  pinSlotBottom: {
    marginTop: 2,
  },
  pinSlotTop: {
    marginTop: -1,
  },
  playsCol: {
    marginLeft: spacing.sm,
    minWidth: 72,
  },
  outerValue: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.072,
    color: colors.action.onDisabled,
  },
  outerValueScorecard: {
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.096,
  },
  middleValue: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.088,
    color: inRoundColors.textInverse,
  },
  middleValueScorecard: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.36,
  },
  pinLine: {
    position: "absolute",
    left: 42 + spacing.xs + 3,
    top: 7,
    bottom: 8,
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.action.onDisabled,
    zIndex: 0,
  },
  pinLineScorecard: {
    // yards col (72) + slot margin (sm) + centre of 16px slot − half of 2px line
    left: 72 + spacing.sm + 7,
    top: 18,
    bottom: 18,
  },
  pinDotOuter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.action.onDisabled,
  },
  pinDotOuterScorecard: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pinDotMiddle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: inRoundColors.textInverse,
  },
  pinDotMiddleScorecard: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  playsLikeLabel: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.04,
    color: inRoundColors.textInverse,
    transform: [{ translateY: 8 }],
  },
  playsLikeLabelScorecard: {
    fontSize: 12,
    lineHeight: 16,
    transform: [{ translateY: 10 }],
  },
  playsLikeValue: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.088,
    color: inRoundColors.textInverse,
  },
  playsLikeValueScorecard: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.36,
  },
  playsLikeClub: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.04,
    color: inRoundColors.textInverse,
    transform: [{ translateY: -8 }],
  },
  playsLikeClubScorecard: {
    fontSize: 12,
    lineHeight: 16,
    transform: [{ translateY: -10 }],
  },
});
