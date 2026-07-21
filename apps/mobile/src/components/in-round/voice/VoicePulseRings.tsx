import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type VoicePulseRingsProps = {
  active: boolean;
};

const RING_SIZE = 168;
const RING_DELAYS = [0, 700, 1400];

function PulseRing({
  active,
  delayMs,
}: {
  active: boolean;
  delayMs: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(progress, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [active, delayMs, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.18],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 0.45, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export function VoicePulseRings({ active }: VoicePulseRingsProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      {RING_DELAYS.map((delayMs) => (
        <PulseRing key={delayMs} active={active} delayMs={delayMs} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: "rgba(74, 222, 128, 0.55)",
    backgroundColor: "rgba(74, 222, 128, 0.08)",
  },
});
