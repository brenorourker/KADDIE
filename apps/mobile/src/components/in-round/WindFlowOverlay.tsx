import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { getWindIconColor } from "../../round/services/windColor";

type WindFlowOverlayProps = {
  width: number;
  height: number;
  speedKph: number;
  /** Compass bearing wind blows toward: 0 = N, 90 = E. */
  bearingDeg: number;
};

type StreakSeed = {
  id: number;
  startX: number;
  startY: number;
  length: number;
  thickness: number;
  durationMs: number;
  delayMs: number;
  travel: number;
  opacity: number;
  /** Degrees off main wind bearing (±~3°) for natural variation. */
  bearingOffsetDeg: number;
};

/** Deterministic 0–1 from integer seed (avoids reshuffle every render). */
function hash01(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function streakCountForSpeed(speedKph: number) {
  if (speedKph <= 8) return 24;
  if (speedKph <= 15) return 36;
  if (speedKph <= 25) return 48;
  if (speedKph <= 40) return 60;
  return 72;
}

function buildStreaks(
  width: number,
  height: number,
  speedKph: number,
  bearingDeg: number,
): StreakSeed[] {
  const count = streakCountForSpeed(speedKph);
  const baseDuration = Math.max(2200, 9000 - speedKph * 90);
  const baseOpacity = Math.min(0.55, 0.18 + speedKph / 90);
  const baseLength = 22 + Math.min(48, speedKph * 1.05);
  const travel = Math.max(width, height) * 0.55 + speedKph * 2;

  const seeds: StreakSeed[] = [];
  for (let i = 0; i < count; i++) {
    const a = hash01(bearingDeg * 10 + speedKph + i * 17);
    const b = hash01(bearingDeg * 3 + speedKph * 2 + i * 31);
    const c = hash01(i * 53 + speedKph);
    const d = hash01(i * 97 + bearingDeg);
    const e = hash01(i * 71 + bearingDeg * 5 + speedKph);
    seeds.push({
      id: i,
      startX: a * width,
      startY: b * height,
      length: baseLength * (0.65 + c * 0.7),
      thickness: speedKph > 30 ? 2.5 : 2,
      durationMs: baseDuration * (0.75 + d * 0.5),
      delayMs: a * 1800,
      travel,
      opacity: baseOpacity * (0.55 + b * 0.55),
      // Spread evenly in ±3° so paths stay parallel-ish but not identical.
      bearingOffsetDeg: (e - 0.5) * 6,
    });
  }
  return seeds;
}

function WindStreak({
  seed,
  bearingDeg,
  color,
}: {
  seed: StreakSeed;
  bearingDeg: number;
  color: string;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const gradientId = `wind-streak-${seed.id}`;

  useEffect(() => {
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(seed.delayMs),
        Animated.timing(progress, {
          toValue: 1,
          duration: seed.durationMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, seed.delayMs, seed.durationMs]);

  // Slight per-streak wobble off the main wind bearing.
  const streakBearing = bearingDeg + seed.bearingOffsetDeg;

  // Screen coords: 0° = north (−Y), 90° = east (+X).
  const rad = (streakBearing * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dx * seed.travel],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dy * seed.travel],
  });
  const fade = progress.interpolate({
    inputRange: [0, 0.12, 0.75, 1],
    outputRange: [0, seed.opacity, seed.opacity, 0],
  });

  // Streak drawn along +X; rotate so +X = this streak’s direction.
  const rotateDeg = streakBearing - 90;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.streak,
        {
          left: seed.startX,
          top: seed.startY,
          width: seed.length,
          height: seed.thickness,
          opacity: fade,
          transform: [
            { translateX },
            { translateY },
            { rotate: `${rotateDeg}deg` },
          ],
        },
      ]}
    >
      {/* Trail (left) fades out; tip / front (right) is full colour. */}
      <Svg width={seed.length} height={seed.thickness}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={color} stopOpacity={0} />
            <Stop offset="0.45" stopColor={color} stopOpacity={0.35} />
            <Stop offset="0.78" stopColor={color} stopOpacity={0.85} />
            <Stop offset="1" stopColor={color} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={seed.length}
          height={seed.thickness}
          rx={seed.thickness / 2}
          ry={seed.thickness / 2}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </Animated.View>
  );
}

/**
 * Lightweight Weather-style wind streaks over the map.
 * Uses RN Animated + SVG gradients — no Skia. Density/speed scale with wind kph.
 */
export function WindFlowOverlay({
  width,
  height,
  speedKph,
  bearingDeg,
}: WindFlowOverlayProps) {
  const streaks = useMemo(
    () =>
      width > 0 && height > 0
        ? buildStreaks(width, height, speedKph, bearingDeg)
        : [],
    [width, height, speedKph, bearingDeg],
  );

  if (streaks.length === 0 || speedKph <= 0) {
    return null;
  }

  const color = getWindIconColor(speedKph);

  return (
    <View pointerEvents="none" style={styles.root}>
      {streaks.map((seed) => (
        <WindStreak
          key={`${seed.id}-${speedKph}-${bearingDeg}`}
          seed={seed}
          bearingDeg={bearingDeg}
          color={color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    overflow: "hidden",
  },
  streak: {
    position: "absolute",
    overflow: "hidden",
  },
});
