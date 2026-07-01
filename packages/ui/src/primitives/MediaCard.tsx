import type { ImageSourcePropType } from "react-native";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  controlSize,
  radii,
  spacing,
  typography,
} from "../tokens";
import { Button } from "./Button";

export type MediaCardActions = "one-button" | "two-buttons";

export type MediaCardProps = {
  title: string;
  body: string;
  imageSource?: ImageSourcePropType;
  actions?: MediaCardActions;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryActionPress?: () => void;
  onSecondaryActionPress?: () => void;
  style?: ViewStyle;
};

export function MediaCard({
  title,
  body,
  imageSource,
  actions = "two-buttons",
  primaryActionLabel = "Read",
  secondaryActionLabel = "Share",
  onPrimaryActionPress,
  onSecondaryActionPress,
  style,
}: MediaCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.media}>
        {imageSource ? (
          <Image
            accessibilityIgnoresInvertColors
            source={imageSource}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>

      <View
        style={[
          styles.actions,
          actions === "two-buttons" ? styles.actionsTwoButtons : null,
        ]}
      >
        <Button
          label={primaryActionLabel}
          size="sm"
          onPress={onPrimaryActionPress}
        />
        {actions === "two-buttons" ? (
          <Button
            label={secondaryActionLabel}
            size="sm"
            variant="ghost"
            onPress={onSecondaryActionPress}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: controlSize.mediaCardWidth,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    overflow: "hidden",
  },
  media: {
    height: controlSize.mediaCardImageHeight,
    width: "100%",
    backgroundColor: colors.background.muted,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    gap: spacing.xxs,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  body: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  actionsTwoButtons: {
    justifyContent: "space-between",
  },
});
