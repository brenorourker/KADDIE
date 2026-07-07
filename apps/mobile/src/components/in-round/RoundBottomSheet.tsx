import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, fontFamily, radii, spacing } from "@kaddie/ui";
import { useRoundMap } from "../../round/RoundMapProvider";
import {
  SHEET_COLLAPSED_HEIGHT,
  SHEET_EXPANDED_HEIGHT,
} from "../../round/hooks/useAnimatedSheetHeight";
import { inRoundColors } from "../../round/inRoundTheme";
import { LieSlopeSection } from "./LieSlopeSection";

type RoundBottomSheetProps = {
  animatedHeight: Animated.Value;
  expandProgress: Animated.Value;
};

export function RoundBottomSheet({
  animatedHeight,
  expandProgress,
}: RoundBottomSheetProps) {
  const {
    sheetExpanded,
    toggleSheetExpanded,
    displayDistances,
    clubRecommendation,
  } = useRoundMap();

  const expandedOpacity = expandProgress;
  const expandedTranslateY = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View style={[styles.sheet, { height: animatedHeight }]}>
      <Pressable
        accessibilityLabel={sheetExpanded ? "Collapse shot details" : "Expand shot details"}
        accessibilityRole="button"
        onPress={toggleSheetExpanded}
        style={styles.handleArea}
      >
        <View style={styles.handle} />
      </Pressable>

      <View style={styles.distancesRow}>
        <DistanceColumn label="FRONT" value={displayDistances.front} emphasis={false} />
        <DistanceColumn
          label="MIDDLE"
          value={displayDistances.middle}
          club={clubRecommendation}
          emphasis
        />
        <DistanceColumn label="BACK" value={displayDistances.back} emphasis={false} />
      </View>

      <Animated.View
        pointerEvents={sheetExpanded ? "auto" : "none"}
        style={[
          styles.expandedContent,
          {
            opacity: expandedOpacity,
            transform: [{ translateY: expandedTranslateY }],
          },
        ]}
      >
        <View style={styles.divider} />
        <LieSlopeSection />
      </Animated.View>
    </Animated.View>
  );
}

function DistanceColumn({
  label,
  value,
  club,
  emphasis = false,
}: {
  label: string;
  value: number;
  club?: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.distanceColumn}>
      <Text style={styles.distanceLabel}>{label}</Text>
      <Text style={[styles.distanceValue, emphasis && styles.distanceValueEmphasis]}>
        {value}{" "}
        <Text style={[styles.distanceUnit, emphasis && styles.distanceUnitEmphasis]}>
          YDS
        </Text>
      </Text>
      {club ? <Text style={styles.clubLabel}>{club}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: "hidden",
  },
  handleArea: {
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border.default,
  },
  distancesRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  expandedContent: {
    overflow: "hidden",
  },
  distanceColumn: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  distanceLabel: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
  distanceValue: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.08,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
  distanceValueEmphasis: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.088,
  },
  distanceUnit: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 12,
    lineHeight: 20,
  },
  distanceUnitEmphasis: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  clubLabel: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: colors.action.onDisabled,
    textAlign: "center",
    marginTop: spacing.xxs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
});

export const roundBottomSheetHeights = {
  collapsed: SHEET_COLLAPSED_HEIGHT,
  expanded: SHEET_EXPANDED_HEIGHT,
};
