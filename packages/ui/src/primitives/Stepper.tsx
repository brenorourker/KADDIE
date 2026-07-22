import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useColors } from "../theme/Theme";
import { controlSize, radii, spacing } from "../tokens";

export type StepperProps = {
  currentStep?: number;
  totalSteps?: number;
  style?: ViewStyle;
};

function StepIndicator({ active }: { active: boolean }) {
  const colors = useColors();
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      progress.setValue(active ? 1 : 0);
      return;
    }

    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [active, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [controlSize.stepperDot, controlSize.stepperActiveWidth],
  });

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.default, colors.action.primary],
  });

  return (
    <Animated.View
      style={[
        styles.indicator,
        {
          width,
          backgroundColor,
        },
      ]}
    />
  );
}

export function Stepper({
  currentStep = 1,
  totalSteps = 3,
  style,
}: StepperProps) {
  const safeTotalSteps = Math.max(1, totalSteps);
  const safeCurrentStep = Math.min(
    Math.max(1, currentStep),
    safeTotalSteps,
  );

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: safeTotalSteps,
        now: safeCurrentStep,
      }}
      style={[styles.container, style]}
    >
      {Array.from({ length: safeTotalSteps }, (_, index) => (
        <StepIndicator
          key={index}
          active={index + 1 === safeCurrentStep}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  indicator: {
    height: controlSize.stepperHeight,
    borderRadius: radii.full,
  },
});
