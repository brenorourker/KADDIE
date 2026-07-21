import { useCallback, useEffect, useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  View,
  type LayoutRectangle,
} from "react-native";
import { inRoundColors } from "../../../round/inRoundTheme";
import { VoiceSpeakerIcon, VoiceSpeakerMutedIcon } from "./VoiceModeIcons";

const SLIDER_HEIGHT = 128;
const LONG_PRESS_MS = 280;
const TAP_MOVE_THRESHOLD = 10;

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

type VoiceVolumeControlProps = {
  onVolumeChange?: (volume: number) => void;
  onMutedChange?: (muted: boolean) => void;
};

export function VoiceVolumeControl({
  onVolumeChange,
  onMutedChange,
}: VoiceVolumeControlProps) {
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);

  const trackRef = useRef<View>(null);
  const trackLayoutRef = useRef<LayoutRectangle | null>(null);
  const longPressTriggeredRef = useRef(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef({ time: 0 });
  const volumeRef = useRef(volume);
  const mutedRef = useRef(muted);

  volumeRef.current = volume;
  mutedRef.current = muted;

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow((x, y, width, height) => {
      trackLayoutRef.current = { x, y, width, height };
    });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(measureTrack);
    return () => cancelAnimationFrame(frame);
  }, [measureTrack]);

  const updateVolume = useCallback(
    (next: number) => {
      const clamped = clampVolume(next);
      setVolume(clamped);
      onVolumeChange?.(clamped);

      if (clamped > 0 && mutedRef.current) {
        setMuted(false);
        onMutedChange?.(false);
      }
    },
    [onMutedChange, onVolumeChange],
  );

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      onMutedChange?.(next);
      return next;
    });
  }, [onMutedChange]);

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  const volumeFromPageY = useCallback((pageY: number) => {
    const track = trackLayoutRef.current;
    if (!track) return volumeRef.current;

    const relativeY = pageY - track.y;
    const normalized = 1 - relativeY / track.height;
    return clampVolume(normalized);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        longPressTriggeredRef.current = false;
        pressStartRef.current = { time: Date.now() };

        clearPressTimer();
        pressTimerRef.current = setTimeout(() => {
          longPressTriggeredRef.current = true;
          setSliderVisible(true);
        }, LONG_PRESS_MS);
      },
      onPanResponderMove: (event, gesture) => {
        const moved = Math.abs(gesture.dy) > TAP_MOVE_THRESHOLD;

        if (longPressTriggeredRef.current || moved) {
          clearPressTimer();
          longPressTriggeredRef.current = true;
          setSliderVisible(true);
          measureTrack();
          updateVolume(volumeFromPageY(event.nativeEvent.pageY));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        clearPressTimer();

        const duration = Date.now() - pressStartRef.current.time;
        const moved =
          Math.abs(gesture.dy) > TAP_MOVE_THRESHOLD ||
          Math.abs(gesture.dx) > TAP_MOVE_THRESHOLD;

        if (!longPressTriggeredRef.current && duration < LONG_PRESS_MS && !moved) {
          toggleMuted();
        }

        longPressTriggeredRef.current = false;
        setSliderVisible(false);
      },
      onPanResponderTerminate: () => {
        clearPressTimer();
        longPressTriggeredRef.current = false;
        setSliderVisible(false);
      },
    }),
  ).current;

  const iconColor =
    muted || volume === 0
      ? "rgba(255, 255, 255, 0.35)"
      : inRoundColors.textInverse;

  const fillHeight = muted ? 0 : volume * (SLIDER_HEIGHT - 16);

  return (
    <View style={styles.wrapper}>
      <View
        ref={trackRef}
        pointerEvents="none"
        style={[styles.sliderPopup, !sliderVisible && styles.sliderHidden]}
      >
        <View style={styles.track}>
          <View style={[styles.trackFill, { height: fillHeight }]} />
        </View>
      </View>

      <View
        {...panResponder.panHandlers}
        accessibilityHint="Press and hold to adjust volume"
        accessibilityLabel={muted ? "Unmute caddie voice" : "Mute caddie voice"}
        accessibilityRole="button"
        style={styles.touchTarget}
      >
        {muted || volume === 0 ? (
          <VoiceSpeakerMutedIcon color={iconColor} />
        ) : (
          <VoiceSpeakerIcon color={iconColor} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  touchTarget: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  sliderPopup: {
    position: "absolute",
    bottom: 48,
    width: 40,
    height: SLIDER_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  track: {
    width: 6,
    flex: 1,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  trackFill: {
    width: "100%",
    borderRadius: 3,
    backgroundColor: "#4ADE80",
  },
  sliderHidden: {
    opacity: 0,
  },
});
