import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const SHEET_COLLAPSED_HEIGHT = 110;
export const SHEET_EXPANDED_HEIGHT = 294;

export function useAnimatedSheetHeight(expanded: boolean) {
  const animatedHeight = useRef(new Animated.Value(SHEET_COLLAPSED_HEIGHT)).current;
  const expandProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue: expanded ? SHEET_EXPANDED_HEIGHT : SHEET_COLLAPSED_HEIGHT,
        useNativeDriver: false,
        tension: 90,
        friction: 14,
      }),
      Animated.timing(expandProgress, {
        toValue: expanded ? 1 : 0,
        duration: expanded ? 280 : 220,
        easing: expanded ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animatedHeight, expandProgress, expanded]);

  const fabBottom = Animated.add(animatedHeight, 12);

  return { animatedHeight, expandProgress, fabBottom };
}
