import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInput as TextInputType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Icon,
  colors,
  controlSize,
  fontFamily,
  iconSize,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import {
  getVoiceModePrompt,
  type VoiceModeState,
} from "../../../round/hooks/useVoiceMode";
import { inRoundColors } from "../../../round/inRoundTheme";
import { VoiceKeyboardIcon } from "./VoiceModeIcons";
import { VoiceMicButton } from "./VoiceMicButton";
import { VoiceVolumeControl } from "./VoiceVolumeControl";

const voiceGlowTop = require("../../../assets/in-round/voice/voice-glow-top.png");

const DEFAULT_PROMPTS = [
  "What's the play?",
  "I'm not confident",
] as const;

type VoiceModeOverlayProps = {
  visible: boolean;
  state: VoiceModeState;
  response: string | null;
  onClose: () => void;
  onMicPress: () => void;
  onSubmitText?: (text: string) => void;
};

export function VoiceModeOverlay({
  visible,
  state,
  response,
  onClose,
  onMicPress,
  onSubmitText,
}: VoiceModeOverlayProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInputType>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [systemKeyboardHeight, setSystemKeyboardHeight] = useState(0);
  const [draftText, setDraftText] = useState("");
  const [volumeControlKey, setVolumeControlKey] = useState(0);

  useEffect(() => {
    if (visible) return;
    setKeyboardVisible(false);
    setSystemKeyboardHeight(0);
    setDraftText("");
    setVolumeControlKey((key) => key + 1);
  }, [visible]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setSystemKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setSystemKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!keyboardVisible) {
      Keyboard.dismiss();
      return;
    }

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(focusTimer);
  }, [keyboardVisible]);

  const prompt = useMemo(() => getVoiceModePrompt(state), [state]);
  const showResponse = state === "responding" && response;

  const handleKeyboardToggle = () => {
    setKeyboardVisible((current) => !current);
  };

  const dismissSystemKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmitText = () => {
    const trimmed = draftText.trim();
    if (!trimmed) return;
    onSubmitText?.(trimmed);
    setDraftText("");
    setKeyboardVisible(false);
    Keyboard.dismiss();
  };

  const handlePromptPress = (promptText: string) => {
    onSubmitText?.(promptText);
    setKeyboardVisible(false);
    Keyboard.dismiss();
  };

  const showPromptChips = !keyboardVisible;

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.root}
      >
        <Image
          accessibilityIgnoresInvertColors
          pointerEvents="none"
          resizeMode="cover"
          source={voiceGlowTop}
          style={styles.ambientGlowTop}
        />

        <Pressable
          accessibilityLabel="Close voice mode"
          accessibilityRole="button"
          hitSlop={12}
          onPress={onClose}
          style={[styles.closeButton, { top: insets.top + 12 }]}
        >
          <Icon color={inRoundColors.textInverse} name="close" size={iconSize.lg} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessible={false}
          onPress={dismissSystemKeyboard}
          style={styles.dismissArea}
        >
          <View
            pointerEvents="box-none"
            style={[
              styles.content,
              {
                paddingBottom:
                  Math.max(insets.bottom, 24) +
                  16 +
                  (Platform.OS === "android" ? systemKeyboardHeight : 0),
              },
            ]}
          >
            <View style={styles.textBlock}>
              {showResponse ? (
                <Text style={styles.response}>{response}</Text>
              ) : prompt ? (
                <Text style={styles.prompt}>{prompt}</Text>
              ) : null}
            </View>

            <VoiceMicButton
              active={state === "listening"}
              onPress={onMicPress}
            />

            {showPromptChips ? (
              <View style={styles.promptChipRow}>
                {DEFAULT_PROMPTS.map((promptText) => (
                  <Pressable
                    key={promptText}
                    accessibilityLabel={promptText}
                    accessibilityRole="button"
                    onPress={() => handlePromptPress(promptText)}
                    style={({ pressed }) => [
                      styles.promptChip,
                      pressed && styles.promptChipPressed,
                    ]}
                  >
                    <Text style={styles.promptChipLabel}>{promptText}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {keyboardVisible ? (
              <View
                onStartShouldSetResponder={() => true}
                style={styles.textInputRow}
              >
                <TextInput
                  ref={inputRef}
                  autoFocus
                  blurOnSubmit={false}
                  placeholder="Type your question..."
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  returnKeyType="send"
                  style={styles.textInput}
                  value={draftText}
                  onChangeText={setDraftText}
                  onSubmitEditing={handleSubmitText}
                />
                <Pressable
                  accessibilityLabel="Send message"
                  accessibilityRole="button"
                  onPress={handleSubmitText}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendLabel}>Send</Text>
                </Pressable>
              </View>
            ) : null}

            <View style={styles.bottomControls}>
              <VoiceVolumeControl key={volumeControlKey} />

              <Pressable
                accessibilityLabel={
                  keyboardVisible ? "Hide keyboard input" : "Show keyboard input"
                }
                accessibilityRole="button"
                hitSlop={12}
                onPress={handleKeyboardToggle}
                style={styles.controlButton}
              >
                <VoiceKeyboardIcon
                  color={
                    keyboardVisible
                      ? "#4ADE80"
                      : inRoundColors.textInverse
                  }
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0F172A",
    overflow: "hidden",
  },
  ambientGlowTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "72%",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    zIndex: 2,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 28,
  },
  textBlock: {
    minHeight: 72,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  prompt: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.08,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
  response: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.04,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
  bottomControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  promptChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  promptChip: {
    height: controlSize.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  promptChipPressed: {
    opacity: 0.85,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  promptChipLabel: {
    ...typography.chipLabel,
    color: inRoundColors.textInverse,
  },
  textInputRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    color: inRoundColors.textInverse,
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ADE80",
  },
  sendLabel: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 14,
    color: "#0F172A",
  },
});
