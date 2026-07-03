import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors, fontFamily, typography } from "@kaddie/ui";

type SplashScreenProps = {
  showText?: boolean;
};

function SplashBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <Svg height={height} style={StyleSheet.absoluteFill} width={width}>
      <Defs>
        <RadialGradient
          cx="50%"
          cy="50%"
          gradientUnits="userSpaceOnUse"
          id="splashGrad"
          rx="50%"
          ry="50%"
        >
          <Stop offset="0" stopColor="#85F788" />
          <Stop offset="0.5" stopColor="#5FED62" />
          <Stop offset="1" stopColor="#38E33C" />
        </RadialGradient>
      </Defs>
      <Rect fill="url(#splashGrad)" height={height} width={width} x="0" y="0" />
    </Svg>
  );
}

export function SplashScreen({ showText = true }: SplashScreenProps) {
  return (
    <View style={styles.root}>
      <SplashBackground />

      {showText ? (
        <View style={styles.content}>
          <Text style={styles.title}>Kaddie</Text>
          <Text style={styles.tagline}>Tour level intelligence</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.action.primary,
  },
  content: {
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: colors.text.primary,
    fontFamily: fontFamily.poppinsBold,
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 48,
    textAlign: "center",
  },
  tagline: {
    ...typography.labelDefault,
    color: colors.text.primary,
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 14,
    letterSpacing: 2.8,
    lineHeight: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
