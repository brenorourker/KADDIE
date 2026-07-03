import { Image, StyleSheet } from "react-native";

const appleLogo = require("../assets/apple-logo.png");

const ICON_SIZE = 28;

export function AppleLogoIcon() {
  return (
    <Image
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      source={appleLogo}
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
