import { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { useRoundMap } from "../../round/RoundMapProvider";
import { getTargetModeMarkers } from "../../round/services/distances";
import type { MapPoint } from "../../round/types";
import { DistancePill } from "./DistancePill";
import { WindBadge } from "./WindBadge";

type MapSize = { width: number; height: number };

type RoundMapCanvasProps = {
  size?: MapSize;
};

function toPixels(point: MapPoint, size: MapSize) {
  return {
    x: point.x * size.width,
    y: point.y * size.height,
  };
}

function getMapImageAspectRatio(
  source: ImageSourcePropType,
  fallback = 953 / 1088,
) {
  const resolve = (
    Image as {
      resolveAssetSource?: (
        src: ImageSourcePropType,
      ) => { width?: number; height?: number } | null;
    }
  ).resolveAssetSource;

  if (typeof resolve === "function") {
    const asset = resolve(source);
    if (asset?.width && asset?.height) {
      return asset.height / asset.width;
    }
  }

  return fallback;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function GpsMarker({ point, size }: { point: MapPoint; size: MapSize }) {
  const { x, y } = toPixels(point, size);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.gpsOuter,
        { left: x - 13, top: y - 13 },
      ]}
    >
      <View style={styles.gpsInner} />
    </View>
  );
}

function TargetRing({
  point,
  size,
  onPress,
}: {
  point: MapPoint;
  size: MapSize;
  onPress?: () => void;
}) {
  const { x, y } = toPixels(point, size);

  return (
    <Pressable
      accessibilityLabel="Set aim target"
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.targetRing, { left: x - 20, top: y - 20 }]}
    >
      <View style={styles.targetRingInner} />
    </Pressable>
  );
}

function DraggableTarget({
  point,
  size,
  onMove,
  onConfirm,
}: {
  point: MapPoint;
  size: MapSize;
  onMove: (point: MapPoint) => void;
  onConfirm: () => void;
}) {
  const originRef = useRef(point);
  const pixelStartRef = useRef(toPixels(point, size));

  originRef.current = point;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pixelStartRef.current = toPixels(originRef.current, size);
      },
      onPanResponderMove: (_, gesture) => {
        onMove({
          x: clamp01((pixelStartRef.current.x + gesture.dx) / size.width),
          y: clamp01((pixelStartRef.current.y + gesture.dy) / size.height),
        });
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) < 4 && Math.abs(gesture.dy) < 4) {
          onConfirm();
          return;
        }
        onMove({
          x: clamp01((pixelStartRef.current.x + gesture.dx) / size.width),
          y: clamp01((pixelStartRef.current.y + gesture.dy) / size.height),
        });
      },
    }),
  ).current;

  const { x, y } = toPixels(point, size);

  return (
    <View
      {...panResponder.panHandlers}
      style={[styles.draggableTarget, { left: x - 20, top: y - 20 }]}
    >
      <View style={styles.draggableTargetInner} />
    </View>
  );
}

function GreenMarker({ point, size }: { point: MapPoint; size: MapSize }) {
  const { x, y } = toPixels(point, size);

  return (
    <View
      pointerEvents="none"
      style={[styles.greenMarker, { left: x - 12, top: y - 12 }]}
    >
      <View style={styles.greenMarkerInner} />
    </View>
  );
}

export function RoundMapCanvas({ size }: RoundMapCanvasProps) {
  const {
    currentHole,
    targetMode,
    target,
    enterTargetMode,
    exitTargetMode,
    setTarget,
  } = useRoundMap();
  const [layoutSize, setLayoutSize] = useState<MapSize>({ width: 0, height: 0 });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setLayoutSize({ width, height });
    }
  }, []);

  const mapSize = useMemo<MapSize>(() => {
    if (layoutSize.width > 0 && layoutSize.height > 0) {
      return layoutSize;
    }

    if (size && size.width > 0 && size.height > 0) {
      return size;
    }

    return { width: 0, height: 0 };
  }, [layoutSize, size]);

  const markers = useMemo(() => {
    if (targetMode) {
      return getTargetModeMarkers(currentHole.player, target, currentHole.green);
    }
    return currentHole.markers;
  }, [currentHole, target, targetMode]);

  const lineSegments = useMemo(() => {
    if (mapSize.width === 0) return [];

    if (targetMode) {
      const player = toPixels(currentHole.player, mapSize);
      const aim = toPixels(target, mapSize);
      const green = toPixels(currentHole.green, mapSize);
      return [
        { x1: player.x, y1: player.y, x2: aim.x, y2: aim.y },
        { x1: aim.x, y1: aim.y, x2: green.x, y2: green.y },
      ];
    }

    const player = toPixels(currentHole.player, mapSize);
    const green = toPixels(currentHole.green, mapSize);
    return [{ x1: player.x, y1: player.y, x2: green.x, y2: green.y }];
  }, [currentHole.green, currentHole.player, mapSize, target, targetMode]);

  const hasSize = mapSize.width > 0 && mapSize.height > 0;

  const mapImageLayout = useMemo(() => {
    if (!hasSize) return null;

    const aspectRatio = getMapImageAspectRatio(currentHole.mapImage);
    const imageWidth = mapSize.width * currentHole.mapImageOffset.scale;

    return {
      width: imageWidth,
      height: imageWidth * aspectRatio,
      left: currentHole.mapImageOffset.x * mapSize.width,
      top: currentHole.mapImageOffset.y * mapSize.width,
    };
  }, [currentHole.mapImage, currentHole.mapImageOffset, hasSize, mapSize.height, mapSize.width]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {mapImageLayout ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={currentHole.mapImage}
          style={[styles.mapImage, mapImageLayout]}
        />
      ) : null}

      {hasSize ? (
        <>
          <Svg height={mapSize.height} style={StyleSheet.absoluteFill} width={mapSize.width}>
            {lineSegments.map((segment, index) => (
              <Line
                key={`line-${index}`}
                stroke="#FFFFFF"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeWidth={2}
                x1={segment.x1}
                x2={segment.x2}
                y1={segment.y1}
                y2={segment.y2}
              />
            ))}
            <Circle
              cx={toPixels(currentHole.green, mapSize).x}
              cy={toPixels(currentHole.green, mapSize).y}
              fill="rgba(56, 227, 60, 0.35)"
              r={18}
              stroke="#38E33C"
              strokeWidth={2}
            />
          </Svg>

          {markers.map((marker) => {
            const { x, y } = toPixels(marker.position, mapSize);
            return (
              <DistancePill
                key={marker.id}
                label={marker.label}
                style={{ position: "absolute", left: x - 24, top: y - 10 }}
                variant={marker.variant}
              />
            );
          })}

          <GpsMarker point={currentHole.player} size={mapSize} />

          {targetMode ? (
            <>
              <DraggableTarget
                point={target}
                size={mapSize}
                onConfirm={exitTargetMode}
                onMove={setTarget}
              />
              <GreenMarker point={currentHole.green} size={mapSize} />
            </>
          ) : (
            <TargetRing
              point={currentHole.defaultTarget}
              size={mapSize}
              onPress={enterTargetMode}
            />
          )}
        </>
      ) : null}

      <WindBadge speedKph={currentHole.windKph} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#1E293B",
  },
  mapImage: {
    position: "absolute",
  },
  gpsOuter: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#38E33C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  gpsInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  targetRing: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  targetRingInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  draggableTarget: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 5,
  },
  draggableTargetInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0F172A",
  },
  greenMarker: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#38E33C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  greenMarkerInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
});
