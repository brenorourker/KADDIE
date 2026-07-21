import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CaddieFab } from "../../components/in-round/CaddieFab";
import { HoleHeader } from "../../components/in-round/HoleHeader";
import { RoundBottomSheet } from "../../components/in-round/RoundBottomSheet";
import { RoundMapCanvas } from "../../components/in-round/RoundMapCanvas";
import {
  SHEET_COLLAPSED_HEIGHT,
  useAnimatedSheetHeight,
} from "../../round/hooks/useAnimatedSheetHeight";
import { useRoundMap } from "../../round/RoundMapProvider";
import { inRoundColors } from "../../round/inRoundTheme";

export function RoundMapScreen() {
  const insets = useSafeAreaInsets();
  const { sheetExpanded } = useRoundMap();
  const window = useWindowDimensions();
  const { animatedHeight, expandProgress, fabBottom, snapTo } =
    useAnimatedSheetHeight(sheetExpanded);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [bottomSheetHeight, setBottomSheetHeight] = useState(
    SHEET_COLLAPSED_HEIGHT,
  );

  useEffect(() => {
    const listenerId = animatedHeight.addListener(({ value }) => {
      setBottomSheetHeight(value);
    });

    return () => {
      animatedHeight.removeListener(listenerId);
    };
  }, [animatedHeight]);

  const mapCanvasSize = useMemo(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      return canvasSize;
    }

    if (window.width > 0 && window.height > 0) {
      return {
        width: window.width,
        height: Math.max(window.height - 200, 280),
      };
    }

    return canvasSize;
  }, [canvasSize, window.height, window.width]);

  const onCanvasHostLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCanvasSize({ width, height });
    }
  }, []);

  return (
    <View style={[styles.root, { marginTop: -insets.top }]}>
      <View style={styles.header}>
        <HoleHeader />
      </View>

      <View style={styles.canvasHost} onLayout={onCanvasHostLayout}>
        <RoundMapCanvas
          bottomSheetHeight={bottomSheetHeight}
          size={mapCanvasSize}
        />

        <RoundBottomSheet
          animatedHeight={animatedHeight}
          expandProgress={expandProgress}
          snapTo={snapTo}
        />

        <CaddieFab animatedBottom={fabBottom} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: inRoundColors.background,
  },
  header: {
    zIndex: 2,
  },
  canvasHost: {
    flex: 1,
    minHeight: 0,
    position: "relative",
  },
});
