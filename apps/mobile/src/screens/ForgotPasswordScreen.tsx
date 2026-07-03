import { useState } from "react";
import {
  Alert,
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
  Input,
  spacing,
  typography,
} from "@kaddie/ui";

type ForgotPasswordScreenProps = {
  onBack: () => void;
  onResetCodeSent?: () => void;
};

export function ForgotPasswordScreen({
  onBack,
  onResetCodeSent,
}: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [email, setEmail] = useState("brenorourker@gmail.com");

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
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your account and we&apos;ll send a code to
            reset it.
          </Text>
        </View>

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

        <Button
          label="Send reset code"
          size="lg"
          style={styles.fullWidthButton}
          onPress={() => {
            if (onResetCodeSent) {
              onResetCodeSent();
            } else {
              Alert.alert("Send reset code", "Not connected yet.");
            }
          }}
        />

        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backToSignIn}
        >
          <Text style={styles.backToSignInLabel}>Back to sign in</Text>
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
  fullWidthField: {
    maxWidth: "100%",
    width: "100%",
  },
  fullWidthButton: {
    alignSelf: "stretch",
    width: "100%",
  },
  backToSignIn: {
    alignItems: "center",
    width: "100%",
  },
  backToSignInLabel: {
    ...typography.bodySmall,
    color: colors.feedback.successFg,
    textAlign: "center",
  },
});
