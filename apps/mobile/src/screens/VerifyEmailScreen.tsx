import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  Button,
  radii,
  spacing,
  typography,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";

const envelopeIllustration = require("../assets/onboarding/envelope.png");

const RESEND_COOLDOWN_SECONDS = 45;

type VerifyEmailScreenProps = {
  email: string;
  onBack: () => void;
  onChangeEmail: () => void;
};

export function VerifyEmailScreen({
  email,
  onBack,
  onChangeEmail,
}: VerifyEmailScreenProps) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles((c: ColorTokens) => ({
    root: {
      flex: 1,
      backgroundColor: c.background.muted,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      gap: spacing.lg,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing["2xl"],
    },
    illustrationWrap: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: spacing.lg,
      width: "100%" as const,
    },
    illustrationBadge: {
      alignItems: "center" as const,
      backgroundColor: c.feedback.infoBg,
      borderRadius: radii.full,
      height: 112,
      justifyContent: "center" as const,
      width: 112,
    },
    illustration: {
      height: 50,
      width: 50,
    },
    copy: {
      alignItems: "center" as const,
      gap: spacing.sm,
      width: "100%" as const,
    },
    title: {
      ...typography.bodyDefault,
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
    actions: {
      gap: spacing.sm,
      paddingTop: spacing.md,
      width: "100%" as const,
    },
    fullWidthButton: {
      alignSelf: "stretch" as const,
      width: "100%" as const,
    },
    changeEmailRow: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      width: "100%" as const,
    },
    changeEmailMuted: {
      ...typography.bodySmall,
      color: c.text.secondary,
    },
    changeEmailLink: {
      ...typography.bodySmall,
      color: c.feedback.successFg,
    },
  }));
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [secondsLeft]);

  const handleOpenMailApp = async () => {
    const mailUrl = Platform.select({
      ios: "message://",
      android: "mailto:",
      default: "mailto:",
    });

    try {
      const canOpen = await Linking.canOpenURL(mailUrl!);
      if (canOpen) {
        await Linking.openURL(mailUrl!);
        return;
      }
    } catch {
      // Fall through to mock alert.
    }

    Alert.alert("Open mail app", "Not connected yet.");
  };

  const handleResendEmail = () => {
    if (secondsLeft > 0) {
      return;
    }

    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    Alert.alert("Resend email", "Not connected yet.");
  };

  return (
    <View style={styles.root}>
      <AppBar
        leadingAccessibilityLabel="Back"
        title=" "
        onLeadingPress={onBack}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationBadge}>
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={envelopeIllustration}
              style={styles.illustration}
            />
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.subtitle}>
            We sent a verification link to {email} — click it to activate your
            account.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="Open mail app"
            size="lg"
            style={styles.fullWidthButton}
            onPress={handleOpenMailApp}
          />

          <Button
            disabled={secondsLeft > 0}
            label={
              secondsLeft > 0
                ? `Resend email (${secondsLeft}s)`
                : "Resend email"
            }
            size="lg"
            style={styles.fullWidthButton}
            variant="ghost"
            onPress={handleResendEmail}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onChangeEmail}
          style={styles.changeEmailRow}
        >
          <Text style={styles.changeEmailMuted}>Wrong address?</Text>
          <Text style={styles.changeEmailLink}> Change email</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
