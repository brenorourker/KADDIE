import { useCallback, useEffect, useRef, useState } from "react";
import { PanResponder, Platform } from "react-native";
import {
  MAP_VIEWPORT_DEFAULT,
  clampMapScale,
  type MapSize,
  type MapViewport,
  zoomAndRotateViewportAtPoint,
  zoomViewportAtPoint,
} from "../services/mapProjection";

const TAP_THRESHOLD = 10;
const DOUBLE_TAP_MS = 300;
const WHEEL_ZOOM_FACTOR = 0.0012;

type UseMapViewportOptions = {
  mapSize: MapSize;
  resetKey: number;
  onTap: (screenX: number, screenY: number) => void;
  getInitialViewport?: (mapSize: MapSize) => MapViewport;
  /** Image center in screen space for the given viewport (used for twist focal lock). */
  getImageCenter?: (viewport: MapViewport) => { x: number; y: number } | null;
};

function touchDistance(
  touches: ReadonlyArray<{ pageX: number; pageY: number }>,
) {
  if (touches.length < 2) return 0;

  const dx = touches[0].pageX - touches[1].pageX;
  const dy = touches[0].pageY - touches[1].pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

function touchCenter(
  touches: ReadonlyArray<{ pageX: number; pageY: number }>,
) {
  if (touches.length < 2) {
    return { x: touches[0]?.pageX ?? 0, y: touches[0]?.pageY ?? 0 };
  }

  return {
    x: (touches[0].pageX + touches[1].pageX) / 2,
    y: (touches[0].pageY + touches[1].pageY) / 2,
  };
}

function touchAngleDeg(
  touches: ReadonlyArray<{ pageX: number; pageY: number }>,
) {
  if (touches.length < 2) return 0;

  return (
    (Math.atan2(
      touches[1].pageY - touches[0].pageY,
      touches[1].pageX - touches[0].pageX,
    ) *
      180) /
    Math.PI
  );
}

/** Shortest signed delta between two angles in degrees. */
function angleDeltaDeg(from: number, to: number) {
  let delta = to - from;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

export function useMapViewport({
  mapSize,
  resetKey,
  onTap,
  getInitialViewport,
  getImageCenter,
}: UseMapViewportOptions) {
  const [viewport, setViewport] = useState<MapViewport>(MAP_VIEWPORT_DEFAULT);

  const viewportRef = useRef(viewport);
  const onTapRef = useRef(onTap);
  const getInitialViewportRef = useRef(getInitialViewport);
  const getImageCenterRef = useRef(getImageCenter);
  const mapSizeRef = useRef(mapSize);
  const containerOffsetRef = useRef({ x: 0, y: 0 });

  const gestureRef = useRef({
    mode: "none" as "none" | "pan" | "pinch",
    pinchStartDistance: 0,
    pinchStartScale: 1,
    pinchStartRotation: 0,
    pinchStartAngle: 0,
    pinchStartImageCenter: { x: 0, y: 0 },
    panStart: MAP_VIEWPORT_DEFAULT,
    lastTapAt: 0,
    touchStart: { x: 0, y: 0 },
  });

  viewportRef.current = viewport;
  onTapRef.current = onTap;
  getInitialViewportRef.current = getInitialViewport;
  getImageCenterRef.current = getImageCenter;
  mapSizeRef.current = mapSize;

  const resolveInitialViewport = useCallback((size: MapSize) => {
    return getInitialViewportRef.current?.(size) ?? MAP_VIEWPORT_DEFAULT;
  }, []);

  useEffect(() => {
    if (mapSize.width === 0 || mapSize.height === 0) return;
    setViewport(resolveInitialViewport(mapSize));
  }, [mapSize.height, mapSize.width, resetKey, resolveInitialViewport]);

  const setContainerOffset = useCallback((x: number, y: number) => {
    containerOffsetRef.current = { x, y };
  }, []);

  const resetViewport = useCallback(() => {
    setViewport(resolveInitialViewport(mapSizeRef.current));
  }, [resolveInitialViewport]);

  const zoomBy = useCallback((delta: number, focalX: number, focalY: number) => {
    setViewport((current) =>
      zoomViewportAtPoint(
        current,
        focalX,
        focalY,
        clampMapScale(current.scale + delta),
      ),
    );
  }, []);

  const beginPinchRef = useRef(
    (touches: ReadonlyArray<{ pageX: number; pageY: number }>) => {
      const gesture = gestureRef.current;
      const current = viewportRef.current;
      gesture.mode = "pinch";
      gesture.pinchStartDistance = touchDistance(touches);
      gesture.pinchStartScale = current.scale;
      gesture.pinchStartRotation = current.rotationDeg;
      gesture.pinchStartAngle = touchAngleDeg(touches);
      gesture.panStart = current;
      gesture.pinchStartImageCenter = getImageCenterRef.current?.(current) ?? {
        x: mapSizeRef.current.width / 2,
        y: mapSizeRef.current.height / 2,
      };
    },
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const touches = event.nativeEvent.touches;
        const gesture = gestureRef.current;
        gesture.panStart = viewportRef.current;
        gesture.touchStart = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };

        if (touches.length >= 2) {
          beginPinchRef.current(touches);
          return;
        }

        gesture.mode = "pan";
      },
      onPanResponderMove: (event, state) => {
        const touches = event.nativeEvent.touches;
        const gesture = gestureRef.current;

        if (touches.length >= 2) {
          if (gesture.mode !== "pinch") {
            beginPinchRef.current(touches);
          }

          const distance = touchDistance(touches);
          if (gesture.pinchStartDistance <= 0) return;

          const center = touchCenter(touches);
          const offset = containerOffsetRef.current;
          const focalX = center.x - offset.x;
          const focalY = center.y - offset.y;
          const nextScale =
            gesture.pinchStartScale * (distance / gesture.pinchStartDistance);
          const nextRotation =
            gesture.pinchStartRotation +
            angleDeltaDeg(gesture.pinchStartAngle, touchAngleDeg(touches));

          setViewport(
            zoomAndRotateViewportAtPoint(
              gesture.panStart,
              focalX,
              focalY,
              nextScale,
              nextRotation,
              gesture.pinchStartImageCenter,
            ),
          );
          return;
        }

        if (gesture.mode === "pinch") return;

        gesture.mode = "pan";
        setViewport({
          ...gesture.panStart,
          translateX: gesture.panStart.translateX + state.dx,
          translateY: gesture.panStart.translateY + state.dy,
        });
      },
      onPanResponderRelease: (event, state) => {
        const gesture = gestureRef.current;
        const moved =
          Math.abs(state.dx) > TAP_THRESHOLD ||
          Math.abs(state.dy) > TAP_THRESHOLD;

        if (gesture.mode !== "pinch" && !moved) {
          const now = Date.now();
          const nativeEvent = event.nativeEvent as {
            pageX: number;
            pageY: number;
            locationX?: number;
            locationY?: number;
          };
          const offset = containerOffsetRef.current;
          const localX =
            typeof nativeEvent.locationX === "number"
              ? nativeEvent.locationX
              : nativeEvent.pageX - offset.x;
          const localY =
            typeof nativeEvent.locationY === "number"
              ? nativeEvent.locationY
              : nativeEvent.pageY - offset.y;

          if (now - gesture.lastTapAt < DOUBLE_TAP_MS) {
            setViewport(
              getInitialViewportRef.current?.(mapSizeRef.current) ??
                MAP_VIEWPORT_DEFAULT,
            );
            gesture.lastTapAt = 0;
          } else {
            gesture.lastTapAt = now;
            onTapRef.current(localX, localY);
          }
        }

        gesture.mode = "none";
        gesture.pinchStartDistance = 0;
      },
      onPanResponderTerminate: () => {
        gestureRef.current.mode = "none";
        gestureRef.current.pinchStartDistance = 0;
      },
    }),
  ).current;

  const attachWheelZoom = useCallback(
    (element: HTMLElement | null) => {
      if (Platform.OS !== "web" || !element) return undefined;

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const rect = element.getBoundingClientRect();
        const focalX = event.clientX - rect.left;
        const focalY = event.clientY - rect.top;
        const delta = -event.deltaY * WHEEL_ZOOM_FACTOR;

        setViewport((current) =>
          zoomViewportAtPoint(
            current,
            focalX,
            focalY,
            clampMapScale(current.scale + delta),
          ),
        );
      };

      element.addEventListener("wheel", handleWheel, { passive: false });
      return () => element.removeEventListener("wheel", handleWheel);
    },
    [],
  );

  return {
    viewport,
    panHandlers: panResponder.panHandlers,
    resetViewport,
    zoomBy,
    setContainerOffset,
    attachWheelZoom,
  };
}
