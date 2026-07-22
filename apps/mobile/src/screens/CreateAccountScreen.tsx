import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  Button,
  Checkbox,
  Input,
  radii,
  spacing,
  typography,
  useThemedStyles,
  type ColorTokens,
} from "@kaddie/ui";

type CreateAccountScreenProps = {
  onBack: () => void;
  onSignIn: () => void;
  onAccountCreated: (email: string) => void;
};

const PASSWORD_REQUIREMENTS = "12 chars, 1 number, 1 symbol";

function getPasswordStrength(password: string) {
  if (!password) {
    return { filledBars: 0, label: "" };
  }

  const filledBars = [
    password.length >= 8,
    password.length >= 12,
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const label =
    filledBars <= 1
      ? "Weak password"
      : filledBars === 2
        ? "Fair password"
        : filledBars === 3
          ? "Strong password"
          : "Very strong password";

  return { filledBars, label };
}

type PasswordStrengthMeterProps = {
  password: string;
};

function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { filledBars, label } = getPasswordStrength(password);
  const styles = useCreateAccountStyles();

  if (!password) {
    return null;
  }

  return (
    <View style={styles.strengthSection}>
      <View style={styles.strengthBars}>
        {Array.from({ length: 4 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.strengthBar,
              index < filledBars
                ? styles.strengthBarActive
                : styles.strengthBarInactive,
            ]}
          />
        ))}
      </View>

      <View style={styles.strengthLabels}>
        <Text style={styles.strengthLabel}>{label}</Text>
        <Text style={styles.strengthRequirements}>{PASSWORD_REQUIREMENTS}</Text>
      </View>
    </View>
  );
}

export function CreateAccountScreen({
  onBack,
  onSignIn,
  onAccountCreated,
}: CreateAccountScreenProps) {
  const insets = useSafeAreaInsets();
  const styles = useCreateAccountStyles();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [email, setEmail] = useState("brenorourker@gmail.com");
  const [password, setPassword] = useState("password1234");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const canCreateAccount = useMemo(
    () => email.trim().length > 0 && password.length > 0 && termsAccepted,
    [email, password, termsAccepted],
  );

  return (
    <View style={styles.root}>
      <AppBar
        leadingAccessibilityLabel="Back"
        title=" "
        onLeadingPress={onBack}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <View style={styles.copy}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            It only takes a minute. We&apos;ll never share your details.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            containerStyle={styles.fullWidthField}
            keyboardType="email-address"
            label="Email"
            size="lg"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordField}>
            <Input
              autoCapitalize="none"
              autoComplete="password-new"
              containerStyle={styles.fullWidthField}
              label="Password"
              size="lg"
              secureTextEntry={!passwordVisible}
              trailingActionLabel={passwordVisible ? "Hide" : "Show"}
              value={password}
              onChangeText={setPassword}
              onTrailingActionPress={() => setPasswordVisible((visible) => !visible)}
            />

            <PasswordStrengthMeter password={password} />
          </View>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: termsAccepted }}
            onPress={() => setTermsAccepted((accepted) => !accepted)}
            style={styles.termsRow}
          >
            <Checkbox
              accessibilityLabel="Agree to Terms of Service and Privacy Policy"
              checked={termsAccepted}
              onPress={() => setTermsAccepted((accepted) => !accepted)}
            />
            <Text style={styles.termsText}>
              I agree to the Terms of Service and Privacy Policy.
            </Text>
          </Pressable>
        </View>

        <Button
          disabled={!canCreateAccount}
          label="Create account"
          size="lg"
          style={styles.fullWidthButton}
          onPress={() => onAccountCreated(email.trim())}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerMuted}>Already have an account? </Text>
          <Pressable accessibilityRole="button" onPress={onSignIn}>
            <Text style={styles.footerLinkLabel}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function useCreateAccountStyles() {
  return useThemedStyles((c: ColorTokens) => ({
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
      paddingTop: spacing.lg,
    },
    copy: {
      gap: spacing.xxs,
      width: "100%" as const,
    },
    title: {
      ...typography.bodyDefault,
      color: c.text.primary,
    },
    subtitle: {
      ...typography.bodyDefault,
      color: c.text.secondary,
    },
    form: {
      gap: spacing.md,
      width: "100%" as const,
    },
    passwordField: {
      gap: spacing.xxs,
      width: "100%" as const,
    },
    strengthSection: {
      gap: spacing.xxs,
      width: "100%" as const,
    },
    strengthBars: {
      flexDirection: "row" as const,
      gap: spacing.xxs,
      width: "100%" as const,
    },
    strengthBar: {
      borderRadius: radii.full,
      flex: 1,
      height: 4,
    },
    strengthBarActive: {
      backgroundColor: c.action.primary,
    },
    strengthBarInactive: {
      backgroundColor: c.border.default,
    },
    strengthLabels: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      width: "100%" as const,
    },
    strengthLabel: {
      ...typography.caption,
      color: c.text.primary,
    },
    strengthRequirements: {
      ...typography.caption,
      color: c.text.tertiary,
    },
    termsRow: {
      alignItems: "flex-start" as const,
      flexDirection: "row" as const,
      gap: spacing.sm,
      paddingTop: spacing.sm,
      width: "100%" as const,
    },
    termsText: {
      ...typography.bodySmall,
      color: c.text.secondary,
      flex: 1,
    },
    fullWidthField: {
      maxWidth: "100%" as const,
      width: "100%" as const,
    },
    fullWidthButton: {
      alignSelf: "stretch" as const,
      width: "100%" as const,
    },
    footerRow: {
      alignItems: "center" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
    },
    footerMuted: {
      ...typography.bodySmall,
      color: c.text.secondary,
    },
    footerLinkLabel: {
      ...typography.bodySmall,
      color: c.feedback.successFg,
    },
  }));
}
