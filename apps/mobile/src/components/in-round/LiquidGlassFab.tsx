import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { controlSize, radii } from "@kaddie/ui";

type LiquidGlassFabProps = {
  accessibilityLabel: string;
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function LiquidGlassFab({
  accessibilityLabel,
  children,
  onPress,
  style,
}: LiquidGlassFabProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, style]}
    >
      <View style={styles.glass}>
        <View pointerEvents="none" style={styles.highlight} />
        <View pointerEvents="none" style={styles.rim} />
        <View style={styles.content}>{children}</View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: controlSize.lg,
    height: controlSize.lg,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  glass: {
    flex: 1,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    ...Platform.select({
      web: {
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
      default: {},
    }),
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.42)",
    borderLeftColor: "rgba(255, 255, 255, 0.28)",
    borderRightColor: "rgba(255, 255, 255, 0.1)",
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
