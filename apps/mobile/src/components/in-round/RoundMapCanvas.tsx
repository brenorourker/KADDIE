import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Defs, Line, Path, RadialGradient as SvgRadialGradient, Stop } from "react-native-svg";
import { useRoundMap } from "../../round/RoundMapProvider";
import { useMapViewport } from "../../round/hooks/useMapViewport";
import { getGpsCenterY, inRoundLayout } from "../../round/inRoundTheme";
import { SHEET_COLLAPSED_HEIGHT } from "../../round/hooks/useAnimatedSheetHeight";
import {
  clampMapPoint,
  getTargetModeScreenPills,
} from "../../round/services/distances";
import {
  computeBaseImageLayout,
  computeViewportAligningImagePoint,
  imagePointToViewportMapPoint,
  isDefaultMapViewport,
  MAP_VIEWPORT_DEFAULT,
  projectImagePointToScreen,
  projectMapToScreen,
  scaleImageLayout,
  unprojectScreenToImagePoint,
  unprojectScreenToMap,
  type MapImageSize,
  type MapSize,
  type MapImageLayout,
} from "../../round/services/mapProjection";
import type { MapPoint } from "../../round/types";
import { DistancePill } from "./DistancePill";
import { WindBadge } from "./WindBadge";
import { WindFlowOverlay } from "./WindFlowOverlay";

type RoundMapCanvasProps = {
  size?: MapSize;
  bottomSheetHeight?: number;
};

function getMapImageAspectRatio(
  source: ImageSourcePropType,
  mapImageSize?: MapImageSize,
  fallback = 953 / 1088,
) {
  if (mapImageSize?.width && mapImageSize?.height) {
    return mapImageSize.height / mapImageSize.width;
  }

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

function getHoleTargetMarker(hole: {
  markers: Array<{ id: string; offsetX?: number; offsetY?: number }>;
}) {
  return hole.markers.find((marker) => marker.id === "hole-target");
}

function getHoleTargetLineAnchor(
  greenScreen: { x: number; y: number },
  marker: { offsetX?: number; offsetY?: number } | undefined,
) {
  const offsetX = marker?.offsetX ?? 0;
  const offsetY = marker?.offsetY ?? 0;

  return {
    x: greenScreen.x + offsetX,
    y: greenScreen.y - 10 + offsetY + 18,
  };
}

function getDisplayRotationDeg(
  holeRotationDeg: number | undefined,
  viewportRotationDeg: number,
) {
  return (holeRotationDeg ?? 0) + viewportRotationDeg;
}

function projectMarkerToScreen(
  marker: {
    id: string;
    position: MapPoint;
    imagePoint?: MapPoint;
  },
  currentHole: {
    mapImageSize?: MapImageSize;
    mapRotationDeg?: number;
    greenImagePoint?: MapPoint;
  },
  mapImageLayout: MapImageLayout | null,
  mapSize: MapSize,
  viewport: ReturnType<typeof useMapViewport>["viewport"],
  greenScreen: MapPoint,
  displayRotationDeg: number,
) {
  if (marker.imagePoint && currentHole.mapImageSize && mapImageLayout) {
    return projectImagePointToScreen(
      marker.imagePoint,
      currentHole.mapImageSize,
      mapImageLayout,
      displayRotationDeg,
    );
  }

  if (
    marker.id === "hole-target" &&
    currentHole.greenImagePoint &&
    currentHole.mapImageSize &&
    mapImageLayout
  ) {
    return greenScreen;
  }

  return projectMapToScreen(marker.position, mapSize, viewport);
}

function getPlayerAnchor(
  playerScreen: { x: number; y: number },
  offset: { x?: number; y?: number } | undefined,
  mapSize: MapSize,
  viewport: ReturnType<typeof useMapViewport>["viewport"],
  bottomSheetHeight: number,
  snapGpsToSheet: boolean,
) {
  const offsetX = offset?.x ?? 0;

  if (snapGpsToSheet && isDefaultMapViewport(viewport)) {
    return {
      x: playerScreen.x + offsetX,
      y: getGpsCenterY(mapSize.height, bottomSheetHeight),
    };
  }

  return {
    x: playerScreen.x + offsetX,
    y: playerScreen.y,
  };
}

function headingDegToward(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  return (Math.atan2(to.x - from.x, -(to.y - from.y)) * 180) / Math.PI;
}

const GPS_BEAM_SIZE = 72;
const GPS_BEAM_HALF_ANGLE_DEG = 22.5;

function GpsHeadingBeam({ headingDeg }: { headingDeg: number }) {
  const cx = GPS_BEAM_SIZE / 2;
  const cy = GPS_BEAM_SIZE / 2;
  const length = GPS_BEAM_SIZE / 2 - 1;
  const halfRad = (GPS_BEAM_HALF_ANGLE_DEG * Math.PI) / 180;
  const leftX = cx + length * Math.sin(-halfRad);
  const leftY = cy - length * Math.cos(-halfRad);
  const rightX = cx + length * Math.sin(halfRad);
  const rightY = cy - length * Math.cos(halfRad);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.gpsBeam,
        { transform: [{ rotate: `${headingDeg}deg` }] },
      ]}
    >
      <Svg height={GPS_BEAM_SIZE} width={GPS_BEAM_SIZE}>
        <Defs>
          <SvgRadialGradient
            cx={cx}
            cy={cy}
            fx={cx}
            fy={cy}
            id="gpsHeadingBeam"
            r={length}
          >
            <Stop offset="0%" stopColor="#38E33C" stopOpacity={0.45} />
            <Stop offset="55%" stopColor="#38E33C" stopOpacity={0.22} />
            <Stop offset="100%" stopColor="#38E33C" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Path
          d={`M ${cx} ${cy} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`}
          fill="url(#gpsHeadingBeam)"
        />
      </Svg>
    </View>
  );
}

function GpsMarker({
  anchor,
  headingDeg,
}: {
  anchor: { x: number; y: number };
  headingDeg: number;
}) {
  const size = inRoundLayout.gpsMarkerSize;
  const radius = size / 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.gpsMarkerWrap,
        {
          left: anchor.x - GPS_BEAM_SIZE / 2,
          top: anchor.y - GPS_BEAM_SIZE / 2,
        },
      ]}
    >
      <GpsHeadingBeam headingDeg={headingDeg} />
      <View
        style={[
          styles.gpsOuter,
          {
            left: GPS_BEAM_SIZE / 2 - radius,
            top: GPS_BEAM_SIZE / 2 - radius,
          },
        ]}
      >
        <View style={styles.gpsInner} />
      </View>
    </View>
  );
}

function AimTargetRing({
  anchor,
  onConfirm,
}: {
  anchor: { x: number; y: number };
  onConfirm: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel="Confirm aim target"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onConfirm}
      style={[styles.aimTarget, { left: anchor.x - 20, top: anchor.y - 20 }]}
    >
      <View style={styles.aimTargetInner} />
    </Pressable>
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
  const containerRef = useRef<View>(null);

  const mapSize = useMemo<MapSize>(() => {
    if (layoutSize.width > 0 && layoutSize.height > 0) {
      return layoutSize;
    }

    if (size && size.width > 0 && size.height > 0) {
      return size;
    }

    return { width: 0, height: 0 };
  }, [layoutSize, size]);

  const viewportRef = useRef(MAP_VIEWPORT_DEFAULT);
  const targetImagePointRef = useRef<MapPoint | null>(null);
  const baseImageLayoutRef = useRef<MapImageLayout | null>(null);

  const handleMapTap = useCallback(
    (screenX: number, screenY: number) => {
      if (mapSize.width === 0) return;

      let point: MapPoint;
      const viewport = viewportRef.current;

      if (currentHole.mapImageSize && currentHole.mapImageOffset) {
        const aspectRatio = getMapImageAspectRatio(
          currentHole.mapImage,
          currentHole.mapImageSize,
        );
        const layout = scaleImageLayout(
          computeBaseImageLayout(
            mapSize,
            currentHole.mapImageOffset,
            aspectRatio,
          ),
          viewport,
        );
        const displayRotationDeg = getDisplayRotationDeg(
          currentHole.mapRotationDeg,
          viewport.rotationDeg,
        );

        const imagePoint = unprojectScreenToImagePoint(
          screenX,
          screenY,
          currentHole.mapImageSize,
          layout,
          displayRotationDeg,
        );
        targetImagePointRef.current = imagePoint;
        point = clampMapPoint(
          imagePointToViewportMapPoint(
            imagePoint,
            currentHole.mapImageSize,
            currentHole.mapImageOffset,
            aspectRatio,
            mapSize,
            currentHole.mapRotationDeg ?? 0,
          ),
        );
      } else {
        targetImagePointRef.current = null;
        point = clampMapPoint(
          unprojectScreenToMap(screenX, screenY, mapSize, viewport),
        );
      }

      if (targetMode) {
        setTarget(point);
        return;
      }

      enterTargetMode(point);
    },
    [currentHole, enterTargetMode, mapSize, setTarget, targetMode],
  );

  const getInitialViewport = useCallback(
    (size: MapSize) => {
      if (
        size.width === 0 ||
        size.height === 0 ||
        !currentHole.teeImagePoint ||
        !currentHole.mapImageSize ||
        !currentHole.mapImageOffset
      ) {
        return MAP_VIEWPORT_DEFAULT;
      }

      const aspectRatio = getMapImageAspectRatio(
        currentHole.mapImage,
        currentHole.mapImageSize,
      );

      return computeViewportAligningImagePoint(
        currentHole.teeImagePoint,
        currentHole.mapImageSize,
        currentHole.mapImageOffset,
        aspectRatio,
        size,
        currentHole.mapRotationDeg ?? 0,
        {
          x: size.width / 2,
          y: getGpsCenterY(size.height, bottomSheetHeight),
        },
      );
    },
    [bottomSheetHeight, currentHole],
  );

  const getImageCenter = useCallback(
    (nextViewport: typeof MAP_VIEWPORT_DEFAULT) => {
      const base = baseImageLayoutRef.current;
      if (!base) return null;

      const layout = scaleImageLayout(base, nextViewport);
      return {
        x: layout.left + layout.width / 2,
        y: layout.top + layout.height / 2,
      };
    },
    [],
  );

  const {
    viewport,
    panHandlers,
    setContainerOffset,
    attachWheelZoom,
  } = useMapViewport({
    mapSize,
    resetKey: currentHole.number,
    onTap: handleMapTap,
    getInitialViewport,
    getImageCenter,
  });

  viewportRef.current = viewport;

  const displayRotationDeg = getDisplayRotationDeg(
    currentHole.mapRotationDeg,
    viewport.rotationDeg,
  );

  useEffect(() => {
    targetImagePointRef.current = null;
  }, [currentHole.number]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setLayoutSize({ width, height });
      }

      containerRef.current?.measureInWindow((x, y) => {
        setContainerOffset(x, y);
      });
    },
    [setContainerOffset],
  );

  useEffect(() => {
    if (Platform.OS !== "web" || !containerRef.current) return;

    const node = containerRef.current as unknown as HTMLElement;
    return attachWheelZoom(node);
  }, [attachWheelZoom, mapSize.height, mapSize.width]);

  const holeTargetMarker = getHoleTargetMarker(currentHole);

  const hasSize = mapSize.width > 0 && mapSize.height > 0;

  const baseImageLayout = useMemo(() => {
    if (!hasSize) return null;

    const aspectRatio = getMapImageAspectRatio(
      currentHole.mapImage,
      currentHole.mapImageSize,
    );

    return computeBaseImageLayout(
      mapSize,
      currentHole.mapImageOffset,
      aspectRatio,
    );
  }, [
    currentHole.mapImage,
    currentHole.mapImageOffset,
    currentHole.mapImageSize,
    hasSize,
    mapSize,
  ]);

  baseImageLayoutRef.current = baseImageLayout;

  const mapImageLayout = useMemo(() => {
    if (!baseImageLayout) return null;
    return scaleImageLayout(baseImageLayout, viewport);
  }, [baseImageLayout, viewport]);

  const playerScreen = useMemo(() => {
    if (
      currentHole.teeImagePoint &&
      currentHole.mapImageSize &&
      mapImageLayout
    ) {
      return projectImagePointToScreen(
        currentHole.teeImagePoint,
        currentHole.mapImageSize,
        mapImageLayout,
        displayRotationDeg,
      );
    }

    return projectMapToScreen(currentHole.player, mapSize, viewport);
  }, [currentHole, displayRotationDeg, mapImageLayout, mapSize, viewport]);

  const greenScreen = useMemo(() => {
    if (
      currentHole.greenImagePoint &&
      currentHole.mapImageSize &&
      mapImageLayout
    ) {
      return projectImagePointToScreen(
        currentHole.greenImagePoint,
        currentHole.mapImageSize,
        mapImageLayout,
        displayRotationDeg,
      );
    }

    return projectMapToScreen(currentHole.green, mapSize, viewport);
  }, [currentHole, displayRotationDeg, mapImageLayout, mapSize, viewport]);

  const playerAnchor = useMemo(
    () =>
      getPlayerAnchor(
        playerScreen,
        currentHole.playerOffset,
        mapSize,
        viewport,
        bottomSheetHeight,
        currentHole.mapGpsSnapToSheet !== false,
      ),
    [
      bottomSheetHeight,
      currentHole.mapGpsSnapToSheet,
      currentHole.playerOffset,
      mapSize,
      playerScreen,
      viewport,
    ],
  );

  const gpsHeadingDeg = useMemo(
    () => headingDegToward(playerAnchor, greenScreen),
    [greenScreen, playerAnchor],
  );

  const targetAnchor = useMemo(() => {
    if (
      targetImagePointRef.current &&
      currentHole.mapImageSize &&
      mapImageLayout
    ) {
      return projectImagePointToScreen(
        targetImagePointRef.current,
        currentHole.mapImageSize,
        mapImageLayout,
        displayRotationDeg,
      );
    }

    return projectMapToScreen(target, mapSize, viewport);
  }, [
    currentHole.mapImageSize,
    displayRotationDeg,
    mapImageLayout,
    mapSize,
    target,
    viewport,
  ]);

  const greenLineAnchor = useMemo(
    () => getHoleTargetLineAnchor(greenScreen, holeTargetMarker),
    [greenScreen, holeTargetMarker],
  );

  const targetModePills = useMemo(() => {
    if (!targetMode || mapSize.width === 0) return [];

    const topPadding = inRoundLayout.headerTotalHeight + 8;

    return getTargetModeScreenPills(
      playerAnchor,
      targetAnchor,
      greenLineAnchor,
      currentHole.player,
      target,
      currentHole.green,
      mapSize,
      topPadding,
      bottomSheetHeight + inRoundLayout.gpsGapAboveSheet,
    );
  }, [
    bottomSheetHeight,
    currentHole.green,
    currentHole.player,
    greenLineAnchor,
    mapSize,
    playerAnchor,
    target,
    targetAnchor,
    targetMode,
  ]);

  const markers = useMemo(() => {
    const list = currentHole.markers;

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
  }, [currentHole, holeTargetMarker]);

  const displayMarkers = useMemo(() => {
    if (!targetMode) return markers;

    const greenMarker = markers.find((marker) => marker.id === "hole-target");
    return greenMarker ? [...targetModePills, greenMarker] : targetModePills;
  }, [markers, targetMode, targetModePills]);

  const lineSegments = useMemo(() => {
    if (mapSize.width === 0) return [];

    if (targetMode) {
      return [
        {
          x1: playerAnchor.x,
          y1: playerAnchor.y,
          x2: targetAnchor.x,
          y2: targetAnchor.y,
        },
        {
          x1: targetAnchor.x,
          y1: targetAnchor.y,
          x2: greenLineAnchor.x,
          y2: greenLineAnchor.y,
        },
      ];
    }

    return [
      {
        x1: playerAnchor.x,
        y1: playerAnchor.y,
        x2: greenLineAnchor.x,
        y2: greenLineAnchor.y,
      },
    ];
  }, [
    greenLineAnchor,
    mapSize.width,
    playerAnchor,
    targetAnchor,
    targetMode,
  ]);

  return (
    <View ref={containerRef} style={styles.container} onLayout={onLayout}>
      {mapImageLayout ? (
        <View
          style={{
            position: "absolute",
            left: mapImageLayout.left,
            top: mapImageLayout.top,
            width: mapImageLayout.width,
            height: mapImageLayout.height,
            transform:
              displayRotationDeg !== 0
                ? [{ rotate: `${displayRotationDeg}deg` }]
                : undefined,
            ...(Platform.OS === "web"
              ? { transformOrigin: "center center" }
              : null),
          }}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode={currentHole.mapImageSize ? "stretch" : "cover"}
            source={currentHole.mapImage}
            style={styles.mapImage}
          />
        </View>
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

          <View
            {...panHandlers}
            accessibilityLabel={
              targetMode
                ? "Pan map or tap to move aim target"
                : "Pan, pinch, or twist map"
            }
            accessibilityRole="adjustable"
            style={styles.mapGestureLayer}
          />

          <View
            pointerEvents={targetMode ? "none" : "box-none"}
            style={styles.markerLayer}
          >
            {(targetMode ? displayMarkers : markers).map((marker) => {
              const projected =
                targetMode && marker.id.startsWith("target-seg")
                  ? marker.position
                  : projectMarkerToScreen(
                    marker,
                    currentHole,
                    mapImageLayout,
                    mapSize,
                    viewport,
                    greenScreen,
                    displayRotationDeg,
                  );
              const offsetX = "offsetX" in marker ? (marker.offsetX ?? 0) : 0;
              const offsetY = "offsetY" in marker ? (marker.offsetY ?? 0) : 0;

              return (
                <DistancePill
                  key={marker.id}
                  label={marker.label}
                  style={{
                    position: "absolute",
                    left: projected.x - 24 + offsetX,
                    top: projected.y - 10 + offsetY,
                  }}
                  variant={marker.variant}
                />
              );
            })}
          </View>

          <View pointerEvents="box-none" style={styles.gpsLayer}>
            <GpsMarker anchor={playerAnchor} headingDeg={gpsHeadingDeg} />
          </View>

          {targetMode ? (
            <AimTargetRing anchor={targetAnchor} onConfirm={exitTargetMode} />
          ) : null}
        </>
      ) : null}

      <WindFlowOverlay
        width={mapSize.width}
        height={mapSize.height}
        speedKph={currentHole.windKph}
        bearingDeg={currentHole.windBearingDeg}
      />

      <WindBadge
        speedKph={currentHole.windKph}
        bearingDeg={currentHole.windBearingDeg}
      />
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
    height: "100%",
    width: "100%",
  },
  mapGestureLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
    ...(Platform.OS === "web" ? { cursor: "pointer" as const } : null),
  },
  markerLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 8,
  },
  gpsLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9,
  },
  gpsMarkerWrap: {
    position: "absolute",
    width: GPS_BEAM_SIZE,
    height: GPS_BEAM_SIZE,
  },
  gpsBeam: {
    ...StyleSheet.absoluteFillObject,
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
  aimTarget: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 10,
    cursor: "pointer",
  },
  aimTargetInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});
