import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
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

const locationIllustration = require("../assets/onboarding/location-map.png");

const benefits = [
  "Exact yardage",
  "Better strategy & advice",
  "No more guessing",
] as const;

type OnboardingLocationScreenProps = {
  onBack?: () => void;
  onClose?: () => void;
  onEnableLocation: () => void;
  onSkip: () => void;
  embedded?: boolean;
};

function BenefitRow({ label }: { label: string }) {
  const styles = useOnboardingLocationStyles();
  return (
    <View style={styles.benefitRow}>
      <View style={styles.checkmarkBadge}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
      <Text style={styles.benefitText}>{label}</Text>
    </View>
  );
}

export function OnboardingLocationScreen({
  onBack,
  onClose,
  onEnableLocation,
  onSkip,
  embedded = false,
}: OnboardingLocationScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useOnboardingLocationStyles();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  const handleEnableLocation = () => {
    onEnableLocation();
  };

  const content = (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      style={styles.scroll}
    >
      {!embedded ? (
        <Stepper currentStep={2} style={styles.stepper} totalSteps={4} />
      ) : null}

      <View style={styles.illustrationWrap}>
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={locationIllustration}
            style={styles.illustrationImage}
          />
        </View>

        <Text style={styles.title}>Location</Text>
        <Text style={styles.subtitle}>
          Kaddie will automatically detect pins, hazzards & layup zones
        </Text>

        <View style={styles.benefitsSection}>
          {benefits.map((benefit) => (
            <BenefitRow key={benefit} label={benefit} />
          ))}
        </View>

        <View style={styles.footerSpacer} />

        <Button
          label="Enable location"
          size="lg"
          style={styles.fullWidthButton}
          onPress={handleEnableLocation}
        />

        <Pressable
          accessibilityRole="button"
          onPress={onSkip}
          style={styles.skipButton}
        >
        <Text style={styles.skipLabel}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  );

  if (embedded) {
    return <View style={styles.embeddedRoot}>{content}</View>;
  }

  return (
    <View style={styles.root}>
      <View style={[styles.headerBar, { paddingTop: insets.top }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

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

      {content}
    </View>
  );
}

const ILLUSTRATION_SIZE = 112;
const ILLUSTRATION_IMAGE_SIZE = 50;
const CHECKMARK_BADGE_SIZE = 24;

function useOnboardingLocationStyles() {
  return useThemedStyles((c: ColorTokens) => ({
    root: {
      flex: 1,
      backgroundColor: c.background.muted,
    },
    embeddedRoot: {
      flex: 1,
    },
    headerBar: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      minHeight: controlSize.appBar,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
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
    scroll: {
      flex: 1,
    },
    scrollContent: {
      alignItems: "center" as const,
      flexGrow: 1,
      gap: spacing.lg,
      paddingHorizontal: spacing["2xl"],
      paddingTop: spacing.lg,
    },
    stepper: {
      alignSelf: "center" as const,
    },
    illustrationWrap: {
      alignItems: "center" as const,
      backgroundColor: c.feedback.infoBg,
      borderRadius: radii.full,
      height: ILLUSTRATION_SIZE,
      justifyContent: "center" as const,
      width: ILLUSTRATION_SIZE,
    },
    illustrationImage: {
      height: ILLUSTRATION_IMAGE_SIZE,
      width: ILLUSTRATION_IMAGE_SIZE,
    },
    title: {
      ...typography.headingH1,
      color: c.text.primary,
      textAlign: "center" as const,
      width: "100%" as const,
    },
    subtitle: {
      ...typography.bodyDefault,
      color: c.text.secondary,
      textAlign: "center" as const,
      width: "100%" as const,
    },
    benefitsSection: {
      alignSelf: "stretch" as const,
      gap: spacing.md,
      marginTop: spacing.xl,
      width: "100%" as const,
    },
    benefitRow: {
      alignItems: "flex-start" as const,
      flexDirection: "row" as const,
      gap: spacing.md,
      width: "100%" as const,
    },
    checkmarkBadge: {
      alignItems: "center" as const,
      backgroundColor: c.feedback.successBg,
      borderRadius: radii.full,
      height: CHECKMARK_BADGE_SIZE,
      justifyContent: "center" as const,
      width: CHECKMARK_BADGE_SIZE,
    },
    checkmark: {
      color: c.feedback.successFg,
      fontFamily: typography.headingH3.fontFamily,
      fontSize: 12,
      fontWeight: "700" as const,
      lineHeight: 14,
    },
    benefitText: {
      ...typography.bodyDefault,
      color: c.text.secondary,
      flex: 1,
    },
    footerSpacer: {
      flexGrow: 1,
      minHeight: spacing.xl,
    },
    fullWidthButton: {
      alignSelf: "stretch" as const,
      width: "100%" as const,
    },
    skipButton: {
      alignItems: "center" as const,
      height: controlSize.lg,
      justifyContent: "center" as const,
      width: "100%" as const,
    },
    skipLabel: {
      ...typography.bodySmall,
      color: c.text.secondary,
    },
  }));
}
