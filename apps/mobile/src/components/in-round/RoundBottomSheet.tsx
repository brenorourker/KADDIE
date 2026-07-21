import { useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import { colors, radii, spacing } from "@kaddie/ui";
import { useRoundMap } from "../../round/RoundMapProvider";
import {
  SHEET_COLLAPSED_HEIGHT,
  SHEET_EXPANDED_HEIGHT,
} from "../../round/hooks/useAnimatedSheetHeight";
import { DistancesAndPlaysLike } from "./DistancesAndPlaysLike";
import { LieSlopeSection } from "./LieSlopeSection";
import { ShotNumberStepper } from "./ShotNumberStepper";

type RoundBottomSheetProps = {
  animatedHeight: Animated.Value;
  expandProgress: Animated.Value;
  snapTo: (expanded: boolean) => void;
};

const TAP_SLOP = 10;
const VELOCITY_THRESHOLD = 0.55;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function heightToProgress(height: number) {
  const span = SHEET_EXPANDED_HEIGHT - SHEET_COLLAPSED_HEIGHT;
  if (span <= 0) return 0;
  return clamp((height - SHEET_COLLAPSED_HEIGHT) / span, 0, 1);
}

export function RoundBottomSheet({
  animatedHeight,
  expandProgress,
  snapTo,
}: RoundBottomSheetProps) {
  const {
    sheetExpanded,
    setSheetExpanded,
    displayDistances,
    playsLikeYards,
    clubRecommendation,
    shotNumber,
    setShotNumber,
  } = useRoundMap();

  const sheetExpandedRef = useRef(sheetExpanded);
  sheetExpandedRef.current = sheetExpanded;

  const dragStartHeightRef = useRef(SHEET_COLLAPSED_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        animatedHeight.stopAnimation((value) => {
          dragStartHeightRef.current = value;
        });
        expandProgress.stopAnimation();
      },
      onPanResponderMove: (_, gesture) => {
        const nextHeight = clamp(
          dragStartHeightRef.current - gesture.dy,
          SHEET_COLLAPSED_HEIGHT,
          SHEET_EXPANDED_HEIGHT,
        );
        animatedHeight.setValue(nextHeight);
        expandProgress.setValue(heightToProgress(nextHeight));
      },
      onPanResponderRelease: (_, gesture) => {
        const moved =
          Math.abs(gesture.dy) > TAP_SLOP || Math.abs(gesture.vy) > 0.08;

        if (!moved) {
          const nextExpanded = !sheetExpandedRef.current;
          setSheetExpanded(nextExpanded);
          return;
        }

        const releaseHeight = clamp(
          dragStartHeightRef.current - gesture.dy,
          SHEET_COLLAPSED_HEIGHT,
          SHEET_EXPANDED_HEIGHT,
        );
        const midpoint =
          (SHEET_COLLAPSED_HEIGHT + SHEET_EXPANDED_HEIGHT) / 2;

        let nextExpanded: boolean;
        if (gesture.vy < -VELOCITY_THRESHOLD) {
          nextExpanded = true;
        } else if (gesture.vy > VELOCITY_THRESHOLD) {
          nextExpanded = false;
        } else {
          nextExpanded = releaseHeight >= midpoint;
        }

        if (nextExpanded === sheetExpandedRef.current) {
          snapTo(nextExpanded);
        } else {
          setSheetExpanded(nextExpanded);
        }
      },
      onPanResponderTerminate: () => {
        snapTo(sheetExpandedRef.current);
      },
    }),
  ).current;

  const expandedOpacity = expandProgress;
  const expandedTranslateY = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View style={[styles.sheet, { height: animatedHeight }]}>
      <View style={styles.chrome}>
        <View
          {...panResponder.panHandlers}
          accessibilityLabel={
            sheetExpanded ? "Collapse shot details" : "Expand shot details"
          }
          accessibilityRole="button"
          style={styles.dragRegion}
        >
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          <View style={styles.collapsedRow}>
            <DistancesAndPlaysLike
              back={displayDistances.back}
              middle={displayDistances.middle}
              front={displayDistances.front}
              playsLikeYards={playsLikeYards}
              club={clubRecommendation}
            />
          </View>
        </View>

        <View style={styles.shotStepperSlot} pointerEvents="box-none">
          <ShotNumberStepper
            value={shotNumber}
            width={120}
            onDecrement={() => setShotNumber(shotNumber - 1)}
            onIncrement={() => setShotNumber(shotNumber + 1)}
          />
        </View>
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
  chrome: {
    width: "100%",
    minHeight: SHEET_COLLAPSED_HEIGHT,
  },
  dragRegion: {
    width: "100%",
  },
  handleArea: {
    alignItems: "center",
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border.default,
  },
  collapsedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl + 120,
    paddingBottom: spacing.xxs,
  },
  shotStepperSlot: {
    position: "absolute",
    right: spacing.xl,
    top: 26,
    width: 120,
  },
  expandedContent: {
    overflow: "hidden",
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
