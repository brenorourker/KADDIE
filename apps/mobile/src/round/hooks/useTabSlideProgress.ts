import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const TAB_TRANSITION_MS = 280;
/** Short travel keeps the motion subtle rather than a full-screen wipe. */
const TAB_SLIDE_DISTANCE = 40;

type SlideDirection = "from-top" | "from-bottom";

/**
 * Progress 0 → hidden, 1 → visible. Scorecard enters from above; menu from below.
 */
export function useTabSlideProgress(
  active: boolean,
  direction: SlideDirection,
) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: TAB_TRANSITION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  const travel = direction === "from-top" ? -TAB_SLIDE_DISTANCE : TAB_SLIDE_DISTANCE;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [travel, 0],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 1, 1],
  });

  return {
    style: {
      opacity,
      transform: [{ translateY }],
    } as const,
  };
}
