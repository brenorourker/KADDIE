import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  Button,
  colors,
  radii,
  spacing,
  typography,
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    width: "100%",
  },
  illustrationBadge: {
    alignItems: "center",
    backgroundColor: colors.feedback.infoBg,
    borderRadius: radii.full,
    height: 112,
    justifyContent: "center",
    width: 112,
  },
  illustration: {
    height: 50,
    width: 50,
  },
  copy: {
    alignItems: "center",
    gap: spacing.sm,
    width: "100%",
  },
  title: {
    ...typography.bodyDefault,
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
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    width: "100%",
  },
  fullWidthButton: {
    alignSelf: "stretch",
    width: "100%",
  },
  changeEmailRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  changeEmailMuted: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  changeEmailLink: {
    ...typography.bodySmall,
    color: colors.feedback.successFg,
  },
});
