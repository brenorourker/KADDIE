import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useColors } from "../theme/Theme";
import {
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
  type ColorTokens,
} from "../tokens";
import { Button } from "./Button";
import { Icon } from "./Icon";

export type BannerCardStyle = "promo" | "info" | "subtle";

export type BannerCardProps = {
  title?: string;
  body?: string;
  style?: BannerCardStyle;
  actionLabel?: string;
  onActionPress?: () => void;
  onDismissPress?: () => void;
  showDismiss?: boolean;
  containerStyle?: ViewStyle;
};

type VariantConfig = {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  titleColor: string;
  bodyColor: string;
  bodyOpacity?: number;
  dismissIconColor: string;
  buttonVariant: "primary" | "secondary" | "destructive";
};

function getVariantConfig(
  colors: ColorTokens,
): Record<BannerCardStyle, VariantConfig> {
  return {
    promo: {
      backgroundColor: colors.action.primary,
      titleColor: colors.action.onPrimary,
      bodyColor: colors.action.onPrimary,
      bodyOpacity: 0.9,
      dismissIconColor: colors.action.onPrimary,
      buttonVariant: "secondary",
    },
    info: {
      backgroundColor: colors.feedback.infoBg,
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      dismissIconColor: colors.text.primary,
      buttonVariant: "primary",
    },
    subtle: {
      backgroundColor: colors.background.accentSubtle,
      borderColor: colors.border.error,
      borderWidth: 1,
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      dismissIconColor: colors.text.primary,
      buttonVariant: "destructive",
    },
  };
}

export function BannerCard({
  title = "Heading",
  body = "Unlock unlimited projects, advanced exports, and priority support.",
  style = "promo",
  actionLabel = "Upgrade",
  onActionPress,
  onDismissPress,
  showDismiss = true,
  containerStyle,
}: BannerCardProps) {
  const colors = useColors();
  const config = getVariantConfig(colors)[style];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderWidth: config.borderWidth ?? 0,
        },
        containerStyle,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.titleColor }]}>{title}</Text>
        <Text
          style={[
            styles.body,
            {
              color: config.bodyColor,
              opacity: config.bodyOpacity,
            },
          ]}
        >
          {body}
        </Text>
        <Button
          label={actionLabel}
          onPress={onActionPress}
          size="md"
          style={styles.actionButton}
          variant={config.buttonVariant}
        />
      </View>

      {showDismiss ? (
        <Pressable
          accessibilityLabel="Dismiss banner"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onDismissPress}
          style={({ pressed }) => [
            styles.dismiss,
            pressed ? styles.dismissPressed : null,
          ]}
        >
          <Icon
            color={config.dismissIconColor}
            name="close"
            size={iconSize.md}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: controlSize.bannerCardWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
    alignItems: "flex-start",
  },
  actionButton: {
    alignSelf: "flex-start",
  },
  title: {
    ...typography.titleDefault,
  },
  body: {
    ...typography.bodySmall,
  },
  dismiss: {
    width: iconSize.lg,
    height: iconSize.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissPressed: {
    opacity: 0.85,
  },
});
