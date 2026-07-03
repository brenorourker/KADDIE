import { useState } from "react";
import {
  Alert,
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
  Input,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { AppleLogoIcon } from "../components/AppleLogoIcon";
import { usePersona } from "../personas/PersonaProvider";

const googleLogo = require("../assets/google-logo.png");

type LogInScreenProps = {
  onSignIn?: () => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
};

export function LogInScreen({
  onSignIn,
  onForgotPassword,
  onCreateAccount,
}: LogInScreenProps) {
  const { activePersona } = usePersona();
  const authData = activePersona.data.auth;
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);
  const [email, setEmail] = useState(authData.email);
  const [password, setPassword] = useState(authData.password);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      style={styles.root}
    >
      <View style={styles.logoBadge}>
        <Text style={styles.logoLetter}>K</Text>
      </View>

      <Text style={styles.heading}>Welcome back</Text>
      <Text style={styles.subheading}>Sign in to your Kaddie account</Text>

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

      <Input
        autoCapitalize="none"
        autoComplete="password"
        containerStyle={styles.fullWidthField}
        label="Password"
        size="lg"
        secureTextEntry={!passwordVisible}
        trailingActionLabel={passwordVisible ? "Hide" : "Show"}
        value={password}
        onChangeText={setPassword}
        onTrailingActionPress={() => setPasswordVisible((visible) => !visible)}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (onForgotPassword) {
            onForgotPassword();
          } else {
            Alert.alert("Forgot password", "Not connected yet.");
          }
        }}
        style={styles.forgotPassword}
      >
        <Text style={styles.linkText}>Forgot password?</Text>
      </Pressable>

      <Button
        label="Sign in"
        style={styles.fullWidthButton}
        onPress={() => {
          if (onSignIn) {
            onSignIn();
          } else {
            Alert.alert("Sign in", "Not connected yet.");
          }
        }}
      />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button
        label="Continue with Apple"
        leadingIcon={<AppleLogoIcon />}
        leadingIconSize={28}
        style={styles.fullWidthButton}
        variant="secondary"
        onPress={() => Alert.alert("Apple sign in", "Not connected yet.")}
      />

      <Button
        label="Continue with Google"
        leadingIcon={
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={googleLogo}
            style={styles.googleIcon}
          />
        }
        style={styles.fullWidthButton}
        variant="secondary"
        onPress={() => Alert.alert("Google sign in", "Not connected yet.")}
      />

      <View style={styles.footerSpacer} />

      <View style={styles.footerRow}>
        <Text style={styles.footerMuted}>New here? </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (onCreateAccount) {
              onCreateAccount();
            } else {
              Alert.alert("Create account", "Not connected yet.");
            }
          }}
        >
          <Text style={styles.footerLinkLabel}>Create account</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing.lg,
  },
  logoBadge: {
    alignItems: "center",
    backgroundColor: colors.action.primary,
    borderRadius: radii.xl,
    height: 72,
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    width: 72,
  },
  logoLetter: {
    fontFamily: "Poppins_700Bold",
    fontSize: 40,
    lineHeight: 48,
    color: colors.text.primary,
  },
  heading: {
    ...typography.headingH1,
    color: colors.text.primary,
  },
  subheading: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  fullWidthField: {
    maxWidth: "100%",
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  linkText: {
    ...typography.labelDefault,
    color: colors.feedback.successFg,
  },
  fullWidthButton: {
    alignSelf: "stretch",
    width: "100%",
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  dividerLine: {
    backgroundColor: colors.border.default,
    flex: 1,
    height: 1,
  },
  dividerLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  googleIcon: {
    height: 24,
    width: 24,
  },
  footerSpacer: {
    flexGrow: 1,
    minHeight: spacing.xl,
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  footerMuted: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  footerLinkLabel: {
    ...typography.bodySmall,
    color: colors.feedback.successFg,
  },
});
