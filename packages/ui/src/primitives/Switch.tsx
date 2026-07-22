import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useColors } from "../theme/Theme";
import { controlSize, radii, type ColorTokens } from "../tokens";

export type SwitchProps = {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

const thumbInset = (controlSize.switchHeight - controlSize.switchThumb) / 2;
const thumbTravel =
  controlSize.switchWidth - controlSize.switchThumb - thumbInset * 2;

export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  style,
}: SwitchProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isOn = value ?? internalValue;
  const progress = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      progress.setValue(isOn ? 1 : 0);
      return;
    }

    Animated.timing(progress, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isOn, progress]);

  const handlePress = () => {
    if (disabled) {
      return;
    }

    const nextValue = !isOn;
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const trackBackgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background.muted, colors.action.primary],
  });

  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, thumbTravel],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: isOn, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.track,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Animated.View
        style={[styles.trackFill, { backgroundColor: trackBackgroundColor }]}
      />
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX: thumbTranslateX }] },
        ]}
      />
    </Pressable>
  );
}

function createStyles(colors: ColorTokens) {
  return StyleSheet.create({
    track: {
      width: controlSize.switchWidth,
      height: controlSize.switchHeight,
      borderRadius: radii.full,
      padding: thumbInset,
      justifyContent: "center",
      overflow: "hidden",
    },
    trackFill: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radii.full,
    },
    disabled: {
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.85,
    },
    thumb: {
      width: controlSize.switchThumb,
      height: controlSize.switchThumb,
      borderRadius: radii.full,
      backgroundColor: colors.background.surface,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
    },
  });
}
