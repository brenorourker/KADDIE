import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Icon, fontFamily, iconSize, radii } from "@kaddie/ui";
import { inRoundColors } from "../../round/inRoundTheme";
import { getWindIconColor } from "../../round/services/windColor";

/** Subtle sway — kept under 10° per design. */
const SWAY_DEGREES = 6;

function pickWindDelta() {
  const magnitude = Math.floor(Math.random() * 3) + 1;
  const sign = Math.random() < 0.5 ? -1 : 1;
  return magnitude * sign;
}

function nextFluctuationDelayMs() {
  return 1800 + Math.random() * 2200;
}

type WindBadgeProps = {
  speedKph: number;
};

export function WindBadge({ speedKph }: WindBadgeProps) {
  const sway = useRef(new Animated.Value(-1)).current;
  const [displaySpeed, setDisplaySpeed] = useState(speedKph);
  const fluctuationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplaySpeed(speedKph);
  }, [speedKph]);

  useEffect(() => {
    const scheduleFluctuation = () => {
      fluctuationTimerRef.current = setTimeout(() => {
        setDisplaySpeed(Math.max(0, speedKph + pickWindDelta()));
        scheduleFluctuation();
      }, nextFluctuationDelayMs());
    };

    scheduleFluctuation();

    return () => {
      if (fluctuationTimerRef.current) {
        clearTimeout(fluctuationTimerRef.current);
      }
    };
  }, [speedKph]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [sway]);

  const rotate = sway.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${SWAY_DEGREES}deg`, `${SWAY_DEGREES}deg`],
  });

  const iconColor = getWindIconColor(speedKph);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconWrap, { transform: [{ rotate }] }]}>
        <Icon color={iconColor} name="wind" size={iconSize.md} />
      </Animated.View>
      <Text style={styles.label}>{displaySpeed} kph</Text>
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
    zIndex: 10,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
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
