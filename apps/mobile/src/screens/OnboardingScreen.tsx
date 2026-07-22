import { useState } from "react";
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
  Dropdown,
  Icon,
  iconSize,
  Input,
  NumberStepper,
  radii,
  spacing,
  Stepper,
  typography,
  useColors,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";
import { usePersona } from "../personas/PersonaProvider";
import { courseOptions } from "./roundConfig";

const caddieIllustration = require("../assets/onboarding/caddie.png");

const swingOptions = [
  { label: "Right handed", value: "right" },
  { label: "Left handed", value: "left" },
] as const;

type OnboardingScreenProps = {
  onClose?: () => void;
  onContinue: () => void;
  onSkip: () => void;
  embedded?: boolean;
};

function parseHandicap(value: string) {
  if (!value || value === "—") {
    return 18;
  }

  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function resolveClubValue(club: string) {
  if (!club || club === "Not set") {
    return "";
  }

  const match = courseOptions.find(
    (option) => option.label === club || option.value === club,
  );

  return match?.value ?? "";
}

export function OnboardingScreen({
  onClose,
  onContinue,
  onSkip,
  embedded = false,
}: OnboardingScreenProps) {
  const { activePersona } = usePersona();
  const profileData = activePersona.data.profile;
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useOnboardingScreenStyles();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [fullName, setFullName] = useState(profileData.fullName);
  const [handicap, setHandicap] = useState(parseHandicap(profileData.handicap));
  const [club, setClub] = useState(resolveClubValue(profileData.club));
  const [swing, setSwing] = useState("right");

  const content = (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      keyboardShouldPersistTaps="handled"
      style={styles.scroll}
    >
      {!embedded ? (
        <Stepper currentStep={1} style={styles.stepper} totalSteps={4} />
      ) : null}

      <View style={styles.avatarWrap}>
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={caddieIllustration}
            style={styles.avatarImage}
          />
        </View>

        <Text style={styles.title}>Your profile</Text>

        <View style={styles.form}>
          <Input
            autoCapitalize="words"
            autoComplete="name"
            containerStyle={styles.fullWidthField}
            label="Name"
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <NumberStepper
            containerStyle={styles.fullWidthField}
            label="Handicap"
            max={54}
            min={0}
            step={1}
            value={handicap}
            onValueChange={setHandicap}
          />

          <Dropdown
            containerStyle={styles.fullWidthField}
            label="Club"
            options={courseOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            placeholder="Select your club"
            value={club}
            onValueChange={setClub}
          />

          <Dropdown
            containerStyle={styles.fullWidthField}
            label="Swing"
            options={swingOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            placeholder="Select your swing"
            value={swing}
            onValueChange={setSwing}
          />
        </View>

        <View style={styles.footerSpacer} />

        <Button
          label="Continue"
          size="lg"
          style={styles.fullWidthButton}
          onPress={onContinue}
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

const AVATAR_SIZE = 112;
const AVATAR_IMAGE_SIZE = 52;

function useOnboardingScreenStyles() {
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
      justifyContent: "flex-end" as const,
      minHeight: controlSize.appBar,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
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
    avatarWrap: {
      alignItems: "center" as const,
      backgroundColor: c.feedback.infoBg,
      borderRadius: radii.full,
      height: AVATAR_SIZE,
      justifyContent: "center" as const,
      width: AVATAR_SIZE,
    },
    avatarImage: {
      height: AVATAR_IMAGE_SIZE,
      width: AVATAR_IMAGE_SIZE,
    },
    title: {
      ...typography.headingH1,
      color: c.text.primary,
      textAlign: "center" as const,
      width: "100%" as const,
    },
    form: {
      alignSelf: "stretch" as const,
      gap: spacing.md,
      width: "100%" as const,
    },
    fullWidthField: {
      maxWidth: "100%" as const,
      width: "100%" as const,
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
