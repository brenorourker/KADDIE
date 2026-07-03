import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  colors,
  controlSize,
  Icon,
  iconSize,
  radii,
  spacing,
  Stepper,
  typography,
} from "@kaddie/ui";

const microphoneIllustration = require("../assets/onboarding/microphone.png");

const benefits = [
  "Hands-free",
  "Natural language",
  "No typing, no tapping....just speak!",
] as const;

type OnboardingMicrophoneScreenProps = {
  onBack?: () => void;
  onClose?: () => void;
  onEnableMicrophone: () => void;
  onSkip: () => void;
  embedded?: boolean;
};

function BenefitRow({ label }: { label: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.checkmarkBadge}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
      <Text style={styles.benefitText}>{label}</Text>
    </View>
  );
}

export function OnboardingMicrophoneScreen({
  onBack,
  onClose,
  onEnableMicrophone,
  onSkip,
  embedded = false,
}: OnboardingMicrophoneScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  const handleEnableMicrophone = () => {
    onEnableMicrophone();
  };

  const content = (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      style={styles.scroll}
    >
      {!embedded ? (
        <Stepper currentStep={3} style={styles.stepper} totalSteps={4} />
      ) : null}

      <View style={styles.illustrationWrap}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={microphoneIllustration}
          style={styles.illustrationImage}
        />
      </View>

      <Text style={styles.title}>Microphone</Text>
      <Text style={styles.subtitle}>
        Talk directly to your Kaddy for your yardage, club selection & strategy
      </Text>

      <View style={styles.benefitsSection}>
        {benefits.map((benefit) => (
          <BenefitRow key={benefit} label={benefit} />
        ))}
      </View>

      <View style={styles.footerSpacer} />

      <Button
        label="Enable microphone"
        size="lg"
        style={styles.fullWidthButton}
        onPress={handleEnableMicrophone}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
  },
  embeddedRoot: {
    flex: 1,
  },
  headerBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: controlSize.appBar,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing.lg,
  },
  stepper: {
    alignSelf: "center",
  },
  illustrationWrap: {
    alignItems: "center",
    backgroundColor: colors.feedback.infoBg,
    borderRadius: radii.full,
    height: ILLUSTRATION_SIZE,
    justifyContent: "center",
    width: ILLUSTRATION_SIZE,
  },
  illustrationImage: {
    height: ILLUSTRATION_IMAGE_SIZE,
    width: ILLUSTRATION_IMAGE_SIZE,
  },
  title: {
    ...typography.headingH1,
    color: colors.text.primary,
    textAlign: "center",
    width: "100%",
  },
  subtitle: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
    textAlign: "center",
    width: "100%",
  },
  benefitsSection: {
    alignSelf: "stretch",
    gap: spacing.md,
    marginTop: spacing.xl,
    width: "100%",
  },
  benefitRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  checkmarkBadge: {
    alignItems: "center",
    backgroundColor: colors.feedback.successBg,
    borderRadius: radii.full,
    height: CHECKMARK_BADGE_SIZE,
    justifyContent: "center",
    width: CHECKMARK_BADGE_SIZE,
  },
  checkmark: {
    color: colors.feedback.successFg,
    fontFamily: typography.headingH3.fontFamily,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  benefitText: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
    flex: 1,
  },
  footerSpacer: {
    flexGrow: 1,
    minHeight: spacing.xl,
  },
  fullWidthButton: {
    alignSelf: "stretch",
    width: "100%",
  },
  skipButton: {
    alignItems: "center",
    height: controlSize.lg,
    justifyContent: "center",
    width: "100%",
  },
  skipLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
