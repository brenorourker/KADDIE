import { Pressable, StyleSheet, View } from "react-native";
import { Icon, iconSize } from "@kaddie/ui";
import { VoicePulseRings } from "./VoicePulseRings";

type VoiceMicButtonProps = {
  active: boolean;
  onPress: () => void;
};

const MIC_SIZE = 100;

export function VoiceMicButton({ active, onPress }: VoiceMicButtonProps) {
  return (
    <View style={styles.container}>
      <VoicePulseRings active={active} />
      <View style={styles.midRing} />
      <Pressable
        accessibilityLabel={active ? "Pause listening" : "Resume listening"}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <View style={styles.buttonHighlight} />
        <Icon color="#0F172A" name="microphone" size={iconSize.lg + 4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 168,
    height: 168,
    alignItems: "center",
    justifyContent: "center",
  },
  midRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(74, 222, 128, 0.12)",
  },
  button: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ADE80",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  buttonHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "42%",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderTopLeftRadius: MIC_SIZE / 2,
    borderTopRightRadius: MIC_SIZE / 2,
  },
});
