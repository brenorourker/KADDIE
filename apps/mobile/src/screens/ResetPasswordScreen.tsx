import { useMemo, useState } from "react";
import {
  Alert,
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
  Icon,
  iconSize,
  Input,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";

type ResetPasswordScreenProps = {
  onBack: () => void;
  onReset?: () => void;
};

type PasswordRequirement = {
  id: string;
  label: string;
  met: boolean;
};

function getPasswordStrength(password: string) {
  if (!password) {
    return { filledBars: 0, hint: "" };
  }

  const checks = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
    longLength: password.length >= 12,
  };

  const filledBars = [
    checks.minLength,
    checks.hasNumber,
    checks.longLength,
    checks.hasSymbol,
  ].filter(Boolean).length;

  let hint = "Strong password";
  if (filledBars <= 1) {
    hint = "Weak — use at least 8 characters and a number";
  } else if (filledBars === 2) {
    hint = checks.hasSymbol
      ? "Fair password"
      : "Medium — add a symbol to make it strong";
  } else if (filledBars === 3 && !checks.hasSymbol) {
    hint = "Medium — add a symbol to make it strong";
  }

  return { filledBars, hint };
}

function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      id: "number",
      label: "Contains a number",
      met: /\d/.test(password),
    },
    {
      id: "symbol",
      label: "Contains a symbol",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

type PasswordStrengthMeterProps = {
  password: string;
};

function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { filledBars, hint } = getPasswordStrength(password);

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
      <Text style={styles.strengthHint}>{hint}</Text>
    </View>
  );
}

type PasswordRequirementsListProps = {
  password: string;
};

function PasswordRequirementsList({ password }: PasswordRequirementsListProps) {
  const requirements = getPasswordRequirements(password);

  return (
    <View style={styles.requirementsList}>
      {requirements.map((requirement) => (
        <View key={requirement.id} style={styles.requirementRow}>
          <Icon
            color={
              requirement.met ? colors.text.primary : colors.text.disabled
            }
            name="check"
            size={iconSize.sm}
          />
          <Text
            style={[
              styles.requirementLabel,
              requirement.met
                ? styles.requirementLabelMet
                : styles.requirementLabelUnmet,
            ]}
          >
            {requirement.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ResetPasswordScreen({ onBack, onReset }: ResetPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const requirements = useMemo(
    () => getPasswordRequirements(password),
    [password],
  );

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const meetsRequirements = requirements.every((requirement) => requirement.met);

  const canReset = meetsRequirements && passwordsMatch;

  const confirmPasswordMessage = useMemo(() => {
    if (!confirmPassword) {
      return undefined;
    }

    return passwordsMatch ? "Passwords match" : "Passwords do not match";
  }, [confirmPassword, passwordsMatch]);

  const handleReset = () => {
    if (!canReset) {
      return;
    }

    if (onReset) {
      onReset();
      return;
    }

    Alert.alert("Reset password", "Not connected yet.");
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
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <View style={styles.copy}>
          <Text style={styles.title}>Set a new password</Text>
          <Text style={styles.subtitle}>
            Pick a strong password you don&apos;t use anywhere else.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.passwordField}>
            <Input
              autoCapitalize="none"
              autoComplete="password-new"
              containerStyle={styles.fullWidthField}
              label="New password"
              size="lg"
              secureTextEntry={!passwordVisible}
              trailingActionLabel={passwordVisible ? "Hide" : "Show"}
              value={password}
              onChangeText={setPassword}
              onTrailingActionPress={() => setPasswordVisible((visible) => !visible)}
            />

            <PasswordStrengthMeter password={password} />
          </View>

          <Input
            autoCapitalize="none"
            autoComplete="password-new"
            containerStyle={styles.fullWidthField}
            error={confirmPassword && !passwordsMatch ? confirmPasswordMessage : undefined}
            helperText={passwordsMatch ? confirmPasswordMessage : undefined}
            label="Confirm password"
            size="lg"
            secureTextEntry={!confirmPasswordVisible}
            trailingActionLabel={confirmPasswordVisible ? "Hide" : "Show"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onTrailingActionPress={() =>
              setConfirmPasswordVisible((visible) => !visible)
            }
          />

          <PasswordRequirementsList password={password} />
        </View>

        <Button
          disabled={!canReset}
          label="Reset password"
          size="lg"
          style={styles.fullWidthButton}
          onPress={handleReset}
        />
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
    paddingTop: spacing.lg,
  },
  copy: {
    gap: spacing.xxs,
    width: "100%",
  },
  title: {
    ...typography.bodyDefault,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  form: {
    gap: spacing.md,
    width: "100%",
  },
  passwordField: {
    gap: spacing.xxs,
    width: "100%",
  },
  strengthSection: {
    gap: spacing.xxs,
    width: "100%",
  },
  strengthBars: {
    flexDirection: "row",
    gap: spacing.xxs,
    width: "100%",
  },
  strengthBar: {
    borderRadius: radii.full,
    flex: 1,
    height: 4,
  },
  strengthBarActive: {
    backgroundColor: colors.action.primary,
  },
  strengthBarInactive: {
    backgroundColor: colors.border.default,
  },
  strengthHint: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  requirementsList: {
    gap: spacing.xxs,
    paddingTop: spacing.sm,
    width: "100%",
  },
  requirementRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  requirementLabel: {
    ...typography.caption,
  },
  requirementLabelMet: {
    color: colors.text.primary,
  },
  requirementLabelUnmet: {
    color: colors.text.tertiary,
  },
  fullWidthField: {
    maxWidth: "100%",
    width: "100%",
  },
  fullWidthButton: {
    alignSelf: "stretch",
    width: "100%",
  },
});
