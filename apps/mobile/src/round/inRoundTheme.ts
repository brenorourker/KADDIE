export const inRoundColors = {
  background: "#0F172A",
  textInverse: "#FFFFFF",
  tabBarBackground: "#0F172A",
} as const;

export const inRoundLayout = {
  /** Figma header frame height (1408:1346) at 390pt width. */
  headerTotalHeight: 110,
  /** Status bar band in the Figma iPhone reference frame. */
  headerDesignStatusBar: 47,
  tabBarHeight: 90,
  /** Gap between FAB bottom edge and top of the tab bar. */
  fabGapAboveTabBar: 24,
  /** Absolute bottom offset for FABs above the tab bar (tabBarHeight + gap). */
  fabBottomOffset: 90 + 24,
  fabHorizontalInset: 12,
  /** Gap between GPS marker bottom edge and bottom sheet top (Figma). */
  gpsGapAboveSheet: 30,
  gpsMarkerSize: 26,
} as const;

export function getGpsCenterY(
  mapHeight: number,
  bottomSheetHeight: number,
) {
  const sheetTop = mapHeight - bottomSheetHeight;
  const radius = inRoundLayout.gpsMarkerSize / 2;

  return sheetTop - inRoundLayout.gpsGapAboveSheet - radius;
}

export function getInRoundHeaderLayout(topInset: number) {
  const topBand = Math.max(topInset, inRoundLayout.headerDesignStatusBar);
  const bodyHeight =
    inRoundLayout.headerTotalHeight - inRoundLayout.headerDesignStatusBar;

  return {
    paddingTop: topBand,
    height: topBand + bodyHeight,
    bodyHeight,
  };
}
