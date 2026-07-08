import { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type ImageSourcePropType,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Line } from "react-native-svg";
import { useRoundMap } from "../../round/RoundMapProvider";
import { getGpsCenterY, inRoundLayout } from "../../round/inRoundTheme";
import { SHEET_COLLAPSED_HEIGHT } from "../../round/hooks/useAnimatedSheetHeight";
import {
  clampMapPoint,
  getTargetModeMarkers,
} from "../../round/services/distances";
import type { MapPoint } from "../../round/types";
import { DistancePill } from "./DistancePill";
import { WindBadge } from "./WindBadge";

type MapSize = { width: number; height: number };

type RoundMapCanvasProps = {
  size?: MapSize;
  bottomSheetHeight?: number;
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

function resolveTapCoordinates(
  event: GestureResponderEvent,
  mapSize: MapSize,
): MapPoint | null {
  if (mapSize.width === 0 || mapSize.height === 0) return null;

  const native = event.nativeEvent as typeof event.nativeEvent & {
    locationX?: number;
    locationY?: number;
    offsetX?: number;
    offsetY?: number;
  };

  const x = native.locationX ?? native.offsetX;
  const y = native.locationY ?? native.offsetY;

  if (x == null || y == null || Number.isNaN(x) || Number.isNaN(y)) {
    return null;
  }

  return {
    x: x / mapSize.width,
    y: y / mapSize.height,
  };
}

function getHoleTargetMarker(hole: { markers: Array<{ id: string; offsetX?: number; offsetY?: number }> }) {
  return hole.markers.find((marker) => marker.id === "hole-target");
}

/** Bottom-center of the hole-target pill — keeps the dashed line attached when nudged. */
function getHoleTargetLineAnchor(
  green: MapPoint,
  marker: { offsetX?: number; offsetY?: number } | undefined,
  mapSize: MapSize,
) {
  const { x, y } = toPixels(green, mapSize);
  const offsetX = marker?.offsetX ?? 0;
  const offsetY = marker?.offsetY ?? 0;

  return {
    x: x + offsetX,
    y: y - 10 + offsetY + 18,
  };
}

function getPlayerAnchor(
  player: MapPoint,
  offset: { x?: number; y?: number } | undefined,
  mapSize: MapSize,
  bottomSheetHeight: number,
) {
  const { x } = toPixels(player, mapSize);
  const radius = inRoundLayout.gpsMarkerSize / 2;

  return {
    x: x + (offset?.x ?? 0),
    y: getGpsCenterY(mapSize.height, bottomSheetHeight),
  };
}

function GpsMarker({ anchor }: { anchor: { x: number; y: number } }) {
  const size = inRoundLayout.gpsMarkerSize;
  const radius = size / 2;

  return (
    <View
      style={[
        styles.gpsOuter,
        { left: anchor.x - radius, top: anchor.y - radius },
      ]}
    >
      <View style={styles.gpsInner} />
    </View>
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
  const onMoveRef = useRef(onMove);
  const onConfirmRef = useRef(onConfirm);

  originRef.current = point;
  onMoveRef.current = onMove;
  onConfirmRef.current = onConfirm;

  const mountedAtRef = useRef(Date.now());

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pixelStartRef.current = toPixels(originRef.current, size);
      },
      onPanResponderMove: (_, gesture) => {
        onMoveRef.current(
          clampMapPoint({
            x: (pixelStartRef.current.x + gesture.dx) / size.width,
            y: (pixelStartRef.current.y + gesture.dy) / size.height,
          }),
        );
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) < 4 && Math.abs(gesture.dy) < 4) {
          if (Date.now() - mountedAtRef.current > 400) {
            onConfirmRef.current();
          }
          return;
        }
        onMoveRef.current(
          clampMapPoint({
            x: (pixelStartRef.current.x + gesture.dx) / size.width,
            y: (pixelStartRef.current.y + gesture.dy) / size.height,
          }),
        );
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

export function RoundMapCanvas({
  size,
  bottomSheetHeight = SHEET_COLLAPSED_HEIGHT,
}: RoundMapCanvasProps) {
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

  const holeTargetMarker = getHoleTargetMarker(currentHole);

  const playerAnchor = useMemo(
    () =>
      getPlayerAnchor(
        currentHole.player,
        currentHole.playerOffset,
        mapSize,
        bottomSheetHeight,
      ),
    [
      bottomSheetHeight,
      currentHole.player,
      currentHole.playerOffset,
      mapSize,
    ],
  );

  const markers = useMemo(() => {
    const list = targetMode
      ? getTargetModeMarkers(
          currentHole.player,
          target,
          currentHole.green,
          currentHole.distances.middle,
        )
      : currentHole.markers;

    if (
      holeTargetMarker?.offsetX == null &&
      holeTargetMarker?.offsetY == null
    ) {
      return list;
    }

    return list.map((marker) =>
      marker.id === "hole-target"
        ? {
            ...marker,
            offsetX: holeTargetMarker.offsetX,
            offsetY: holeTargetMarker.offsetY,
          }
        : marker,
    );
  }, [currentHole, holeTargetMarker, target, targetMode]);

  const lineSegments = useMemo(() => {
    if (mapSize.width === 0) return [];

    const greenAnchor = getHoleTargetLineAnchor(
      currentHole.green,
      holeTargetMarker,
      mapSize,
    );

    if (targetMode) {
      const aim = toPixels(target, mapSize);
      return [
        { x1: playerAnchor.x, y1: playerAnchor.y, x2: aim.x, y2: aim.y },
        { x1: aim.x, y1: aim.y, x2: greenAnchor.x, y2: greenAnchor.y },
      ];
    }

    return [{ x1: playerAnchor.x, y1: playerAnchor.y, x2: greenAnchor.x, y2: greenAnchor.y }];
  }, [
    currentHole.green,
    holeTargetMarker,
    mapSize,
    playerAnchor,
    target,
    targetMode,
  ]);

  const handleMapPress = useCallback(
    (event: GestureResponderEvent) => {
      const tap = resolveTapCoordinates(event, mapSize);
      if (!tap) return;

      const point = clampMapPoint(tap);

      if (targetMode) {
        setTarget(point);
        return;
      }

      enterTargetMode(point);
    },
    [enterTargetMode, mapSize, setTarget, targetMode],
  );

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
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
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
            </Svg>
          </View>

          <Pressable
            accessibilityLabel={
              targetMode ? "Move or clear interim aim target" : "Set interim aim target"
            }
            accessibilityRole="button"
            onPress={handleMapPress}
            style={styles.mapPressLayer}
          />

          <View pointerEvents="box-none" style={styles.markerLayer}>
            {markers.map((marker) => {
              const { x, y } = toPixels(marker.position, mapSize);
              return (
                <DistancePill
                  key={marker.id}
                  label={marker.label}
                  style={{
                    position: "absolute",
                    left: x - 24 + (marker.offsetX ?? 0),
                    top: y - 10 + (marker.offsetY ?? 0),
                  }}
                  variant={marker.variant}
                />
              );
            })}
          </View>

          <View pointerEvents="box-none" style={styles.gpsLayer}>
            <GpsMarker anchor={playerAnchor} />
          </View>

          {targetMode ? (
            <DraggableTarget
              point={target}
              size={mapSize}
              onConfirm={exitTargetMode}
              onMove={setTarget}
            />
          ) : null}
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
  mapPressLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
    cursor: "pointer",
  },
  markerLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 8,
  },
  gpsLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9,
  },
  gpsOuter: {
    position: "absolute",
    width: inRoundLayout.gpsMarkerSize,
    height: inRoundLayout.gpsMarkerSize,
    borderRadius: inRoundLayout.gpsMarkerSize / 2,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  gpsInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#38E33C",
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 5,
  },
  draggableTargetInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});
