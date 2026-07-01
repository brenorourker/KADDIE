import type { ReactNode } from "react";
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
} from "../tokens";
import { Button } from "./Button";
import { Icon } from "./Icon";

export type ModalProps = {
  visible?: boolean;
  title?: string;
  body?: string;
  icon?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancelPress?: () => void;
  onConfirmPress?: () => void;
  onRequestClose?: () => void;
  style?: ViewStyle;
};

function ModalContent({
  title = "Modal title",
  body = "Describe what this dialog is asking the user.",
  icon,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onCancelPress,
  onConfirmPress,
  style,
}: Omit<ModalProps, "visible" | "onRequestClose">) {
  const iconNode =
    icon ?? (
      <Icon name="more" size={iconSize.lg} color={colors.feedback.infoFg} />
    );

  return (
    <View style={[styles.card, style]}>
      <View style={styles.iconContainer}>{iconNode}</View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      <View style={styles.actions}>
        <Button
          label={cancelLabel}
          variant="secondary"
          size="md"
          onPress={onCancelPress}
          style={styles.actionButton}
        />
        <Button
          label={confirmLabel}
          size="md"
          onPress={onConfirmPress}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

export function Modal({
  visible,
  title,
  body,
  icon,
  cancelLabel,
  confirmLabel,
  onCancelPress,
  onConfirmPress,
  onRequestClose,
  style,
}: ModalProps) {
  const content = (
    <ModalContent
      title={title}
      body={body}
      icon={icon}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      onCancelPress={onCancelPress}
      onConfirmPress={onConfirmPress}
      style={style}
    />
  );

  if (visible === undefined) {
    return content;
  }

  const handleBackdropPress = () => {
    onRequestClose?.();
    onCancelPress?.();
  };

  return (
    <RNModal
      animationType="fade"
      onRequestClose={onRequestClose ?? onCancelPress}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close modal"
          onPress={handleBackdropPress}
          style={styles.backdrop}
        />
        <View style={styles.centered}>{content}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
  },
  centered: {
    width: "100%",
    maxWidth: controlSize.modalWidth,
    zIndex: 1,
  },
  card: {
    width: "100%",
    minHeight: controlSize.modalMinHeight,
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radii.xl,
    backgroundColor: colors.background.surface,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: controlSize.modalIcon,
    height: controlSize.modalIcon,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.feedback.infoBg,
    overflow: "hidden",
  },
  title: {
    ...typography.headingH3,
    color: colors.text.primary,
    textAlign: "center",
    width: "100%",
  },
  body: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: "center",
    width: "100%",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: radii.lg,
  },
});
