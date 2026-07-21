import type { MapPoint } from "../types";

export type MapSize = { width: number; height: number };

export type MapImageLayout = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type MapImageSize = {
  width: number;
  height: number;
};

export type MapViewport = {
  scale: number;
  translateX: number;
  translateY: number;
  /** User twist rotation on top of the hole's framing rotation (degrees). */
  rotationDeg: number;
};

export const MAP_VIEWPORT_DEFAULT: MapViewport = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  rotationDeg: 0,
};

export const MAP_MIN_SCALE = 0.35;
export const MAP_MAX_SCALE = 4;

export function clampMapScale(scale: number) {
  return Math.min(MAP_MAX_SCALE, Math.max(MAP_MIN_SCALE, scale));
}

/** True when the map is at the initial 100% view with no pan or twist applied. */
export function isDefaultMapViewport(viewport: MapViewport) {
  return (
    viewport.scale === MAP_VIEWPORT_DEFAULT.scale &&
    viewport.translateX === MAP_VIEWPORT_DEFAULT.translateX &&
    viewport.translateY === MAP_VIEWPORT_DEFAULT.translateY &&
    viewport.rotationDeg === MAP_VIEWPORT_DEFAULT.rotationDeg
  );
}

export function rotatePointAround(
  point: { x: number; y: number },
  origin: { x: number; y: number },
  deltaDeg: number,
) {
  if (deltaDeg === 0) return point;

  const radians = (deltaDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;

  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

/** Pan the map so an image pixel lands at a target screen position (scale 1). */
export function computeViewportAligningImagePoint(
  imagePoint: MapPoint,
  imageSize: MapImageSize,
  mapImageOffset: { x: number; y: number; scale: number },
  imageAspectRatio: number,
  mapSize: MapSize,
  rotationDeg: number,
  targetScreen: { x?: number; y: number },
): MapViewport {
  const baseLayout = computeBaseImageLayout(
    mapSize,
    mapImageOffset,
    imageAspectRatio,
  );
  const screen = projectImagePointToScreen(
    imagePoint,
    imageSize,
    baseLayout,
    rotationDeg,
  );

  return {
    scale: 1,
    translateX:
      targetScreen.x !== undefined ? targetScreen.x - screen.x : 0,
    translateY: targetScreen.y - screen.y,
    rotationDeg: 0,
  };
}

export function projectMapToScreen(
  point: MapPoint,
  viewportSize: MapSize,
  viewport: MapViewport,
) {
  return {
    x: point.x * viewportSize.width * viewport.scale + viewport.translateX,
    y: point.y * viewportSize.height * viewport.scale + viewport.translateY,
  };
}

export function unprojectScreenToMap(
  screenX: number,
  screenY: number,
  viewportSize: MapSize,
  viewport: MapViewport,
): MapPoint {
  const width = viewportSize.width * viewport.scale;
  const height = viewportSize.height * viewport.scale;

  if (width === 0 || height === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: (screenX - viewport.translateX) / width,
    y: (screenY - viewport.translateY) / height,
  };
}

export function zoomViewportAtPoint(
  viewport: MapViewport,
  focalX: number,
  focalY: number,
  nextScale: number,
): MapViewport {
  const scale = clampMapScale(nextScale);
  const ratio = scale / viewport.scale;

  return {
    ...viewport,
    scale,
    translateX: focalX - (focalX - viewport.translateX) * ratio,
    translateY: focalY - (focalY - viewport.translateY) * ratio,
  };
}

/**
 * Combined pinch-zoom + twist around a screen focal point.
 * `imageCenter` is the rotated map image's center for `viewport` (gesture start).
 */
export function zoomAndRotateViewportAtPoint(
  viewport: MapViewport,
  focalX: number,
  focalY: number,
  nextScale: number,
  nextRotationDeg: number,
  imageCenter: { x: number; y: number },
): MapViewport {
  const scaled = zoomViewportAtPoint(viewport, focalX, focalY, nextScale);
  const ratio = scaled.scale / viewport.scale;
  const centerAfterScale = {
    x: focalX + (imageCenter.x - focalX) * ratio,
    y: focalY + (imageCenter.y - focalY) * ratio,
  };
  const deltaRot = nextRotationDeg - viewport.rotationDeg;
  const centerAfterRot = rotatePointAround(
    centerAfterScale,
    { x: focalX, y: focalY },
    deltaRot,
  );

  return {
    scale: scaled.scale,
    rotationDeg: nextRotationDeg,
    translateX:
      scaled.translateX + (centerAfterRot.x - centerAfterScale.x),
    translateY:
      scaled.translateY + (centerAfterRot.y - centerAfterScale.y),
  };
}

export function scaleImageLayout(
  layout: MapImageLayout,
  viewport: MapViewport,
): MapImageLayout {
  return {
    left: layout.left * viewport.scale + viewport.translateX,
    top: layout.top * viewport.scale + viewport.translateY,
    width: layout.width * viewport.scale,
    height: layout.height * viewport.scale,
  };
}

export function computeBaseImageLayout(
  mapSize: MapSize,
  mapImageOffset: { x: number; y: number; scale: number },
  imageAspectRatio: number,
): MapImageLayout {
  const imageWidth = mapSize.width * mapImageOffset.scale;

  return {
    width: imageWidth,
    height: imageWidth * imageAspectRatio,
    left: mapImageOffset.x * mapSize.width,
    top: mapImageOffset.y * mapSize.width,
  };
}

/** Project a pixel on the source map image to screen coordinates. */
export function projectImagePointToScreen(
  point: MapPoint,
  imageSize: MapImageSize,
  layout: MapImageLayout,
  rotationDeg = 0,
): MapPoint {
  const u = point.x / imageSize.width;
  const v = point.y / imageSize.height;
  const localX = u * layout.width;
  const localY = v * layout.height;

  const centerX = layout.width / 2;
  const centerY = layout.height / 2;
  const dx = localX - centerX;
  const dy = localY - centerY;

  const radians = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rotatedX = dx * cos - dy * sin;
  const rotatedY = dx * sin + dy * cos;

  return {
    x: layout.left + centerX + rotatedX,
    y: layout.top + centerY + rotatedY,
  };
}

/** Inverse of {@link projectImagePointToScreen}. Out-of-bounds taps clamp to the image edge. */
export function unprojectScreenToImagePoint(
  screenX: number,
  screenY: number,
  imageSize: MapImageSize,
  layout: MapImageLayout,
  rotationDeg = 0,
): MapPoint {
  const centerX = layout.width / 2;
  const centerY = layout.height / 2;
  const lx = screenX - layout.left;
  const ly = screenY - layout.top;
  const dx = lx - centerX;
  const dy = ly - centerY;

  const radians = (-rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const localX = dx * cos - dy * sin + centerX;
  const localY = dx * sin + dy * cos + centerY;

  const u = Math.min(1, Math.max(0, localX / layout.width));
  const v = Math.min(1, Math.max(0, localY / layout.height));

  return {
    x: u * imageSize.width,
    y: v * imageSize.height,
  };
}

/** Convert a screen tap on a rotated map image to normalized viewport coordinates. */
export function screenPointToImageViewportMapPoint(
  screenX: number,
  screenY: number,
  imageSize: MapImageSize,
  mapImageLayout: MapImageLayout,
  mapImageOffset: { x: number; y: number; scale: number },
  imageAspectRatio: number,
  mapSize: MapSize,
  rotationDeg = 0,
): MapPoint {
  const imagePoint = unprojectScreenToImagePoint(
    screenX,
    screenY,
    imageSize,
    mapImageLayout,
    rotationDeg,
  );

  return imagePointToViewportMapPoint(
    imagePoint,
    imageSize,
    mapImageOffset,
    imageAspectRatio,
    mapSize,
    rotationDeg,
  );
}

/** Convert a source-map pixel to normalized viewport coordinates. */
export function imagePointToViewportMapPoint(
  point: MapPoint,
  imageSize: MapImageSize,
  mapImageOffset: { x: number; y: number; scale: number },
  imageAspectRatio: number,
  mapSize: MapSize,
  rotationDeg = 0,
): MapPoint {
  const layout = computeBaseImageLayout(mapSize, mapImageOffset, imageAspectRatio);
  const screen = projectImagePointToScreen(
    point,
    imageSize,
    layout,
    rotationDeg,
  );

  return {
    x: screen.x / mapSize.width,
    y: screen.y / mapSize.height,
  };
}
