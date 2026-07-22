import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  controlSize,
  Icon,
  iconSize,
  radii,
  spacing,
  Stepper,
  typography,
  useColors,
  useThemedStyles,
  type ColorTokens,
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
  const colors = useColors();
  const styles = useOnboardingFlowStyles();
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

function useOnboardingFlowStyles() {
  return useThemedStyles((c: ColorTokens) => ({
    root: {
      flex: 1,
      backgroundColor: c.background.muted,
    },
    headerBar: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      minHeight: controlSize.appBar,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
    },
    headerSpacer: {
      minHeight: controlSize.md,
      minWidth: controlSize.md,
    },
    backButton: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minHeight: controlSize.md,
      paddingHorizontal: spacing.xs,
    },
    backLabel: {
      ...typography.labelDefault,
      color: c.text.secondary,
    },
    closeButton: {
      alignItems: "center" as const,
      borderRadius: radii.lg,
      height: controlSize.md,
      justifyContent: "center" as const,
      width: controlSize.md,
    },
    stepperWrap: {
      alignItems: "center" as const,
      paddingBottom: spacing.sm,
      paddingTop: spacing.xs,
    },
    pagerViewport: {
      flex: 1,
      overflow: "hidden" as const,
    },
    pagerTrack: {
      flex: 1,
      flexDirection: "row" as const,
    },
    pagerPage: {
      flex: 1,
    },
  }));
}
