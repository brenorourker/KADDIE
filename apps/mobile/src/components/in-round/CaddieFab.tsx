import { useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Icon, Modal, iconSize } from "@kaddie/ui";
import { inRoundColors, inRoundLayout } from "../../round/inRoundTheme";
import { LiquidGlassFab } from "./LiquidGlassFab";
import { SparkleIcon } from "./SparkleIcon";

type CaddieFabProps = {
  bottomInset?: number;
  bottomOffset?: number;
  animatedBottom?: Animated.AnimatedAddition<number>;
};

export function CaddieFab({
  bottomInset = 0,
  bottomOffset,
  animatedBottom,
}: CaddieFabProps) {
  const [assistantVisible, setAssistantVisible] = useState(false);
  const staticBottom =
    bottomOffset ?? inRoundLayout.fabBottomOffset + bottomInset;

  const Container = animatedBottom ? Animated.View : View;
  const containerStyle = animatedBottom
    ? [styles.container, { bottom: animatedBottom }]
    : [styles.container, { bottom: staticBottom }];

  return (
    <>
      <Container pointerEvents="box-none" style={containerStyle}>
        <LiquidGlassFab
          accessibilityLabel="Open AI caddie assistant"
          onPress={() => setAssistantVisible(true)}
        >
          <SparkleIcon color={inRoundColors.textInverse} size={iconSize.lg} />
        </LiquidGlassFab>

        <LiquidGlassFab
          accessibilityLabel="Open voice assistant"
          onPress={() => setAssistantVisible(true)}
        >
          <Icon color={inRoundColors.textInverse} name="microphone" size={iconSize.lg} />
        </LiquidGlassFab>
      </Container>

      <Modal
        body="Your AI caddie assistant will be available here soon."
        cancelLabel="Close"
        confirmLabel="Got it"
        title="AI Caddie"
        visible={assistantVisible}
        onCancelPress={() => setAssistantVisible(false)}
        onConfirmPress={() => setAssistantVisible(false)}
        onRequestClose={() => setAssistantVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: inRoundLayout.fabHorizontalInset,
    right: inRoundLayout.fabHorizontalInset,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
});
