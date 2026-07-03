import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  colors,
  controlSize,
  Icon,
  iconSize,
  radii,
  spacing,
  Stepper,
  typography,
} from "@kaddie/ui";
import { OnboardingLocationScreen } from "../screens/OnboardingLocationScreen";
import { OnboardingMicrophoneScreen } from "../screens/OnboardingMicrophoneScreen";
import { OnboardingNotificationsScreen } from "../screens/OnboardingNotificationsScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";

const TRANSITION_MS = 280;
const ONBOARDING_STEP_COUNT = 4;

type OnboardingFlowProps = {
  initialStep?: number;
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
};

export function OnboardingFlow({
  initialStep = 0,
  onClose,
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(initialStep);
  const slideAnim = useRef(new Animated.Value(initialStep)).current;

  const goToStep = (nextStep: number) => {
    if (nextStep === step) {
      return;
    }

    setStep(nextStep);

    Animated.timing(slideAnim, {
      toValue: nextStep,
      duration: TRANSITION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, -width, -width * 2, -width * 3],
  });

  return (
    <View style={styles.root}>
      <View style={[styles.headerBar, { paddingTop: insets.top }]}>
        {step > 0 ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => goToStep(step - 1)}
            style={styles.backButton}
          >
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <Pressable
          accessibilityLabel="Close"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onClose}
          style={styles.closeButton}
        >
          <Icon color={colors.text.primary} name="close" size={iconSize.lg} />
        </Pressable>
      </View>

      <View style={styles.stepperWrap}>
        <Stepper currentStep={step + 1} totalSteps={4} />
      </View>

      <View style={styles.pagerViewport}>
        <Animated.View
          style={[
            styles.pagerTrack,
            {
              width: width * ONBOARDING_STEP_COUNT,
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={[styles.pagerPage, { width }]}>
            <OnboardingScreen
              embedded
              onContinue={() => goToStep(1)}
              onSkip={onSkip}
            />
          </View>

          <View style={[styles.pagerPage, { width }]}>
            <OnboardingLocationScreen
              embedded
              onEnableLocation={() => goToStep(2)}
              onSkip={() => goToStep(2)}
            />
          </View>

          <View style={[styles.pagerPage, { width }]}>
            <OnboardingMicrophoneScreen
              embedded
              onEnableMicrophone={() => goToStep(3)}
              onSkip={() => goToStep(3)}
            />
          </View>

          <View style={[styles.pagerPage, { width }]}>
            <OnboardingNotificationsScreen
              embedded
              onEnableNotifications={onComplete}
              onSkip={onComplete}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
  },
  headerBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: controlSize.appBar,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  headerSpacer: {
    minHeight: controlSize.md,
    minWidth: controlSize.md,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: controlSize.md,
    paddingHorizontal: spacing.xs,
  },
  backLabel: {
    ...typography.labelDefault,
    color: colors.text.secondary,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: radii.lg,
    height: controlSize.md,
    justifyContent: "center",
    width: controlSize.md,
  },
  stepperWrap: {
    alignItems: "center",
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  pagerViewport: {
    flex: 1,
    overflow: "hidden",
  },
  pagerTrack: {
    flex: 1,
    flexDirection: "row",
  },
  pagerPage: {
    flex: 1,
  },
});
