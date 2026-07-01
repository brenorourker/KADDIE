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
  fontFamily,
} from "../tokens";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarProps = {
  size?: AvatarSize;
  initials?: string;
  source?: ImageSourcePropType;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export const avatarPlaceholderImage = require("../assets/images/avatar-placeholder.jpg");

const sizeConfig = {
  sm: {
    dimension: 32,
    fontSize: 12,
    lineHeight: 16,
  },
  md: {
    dimension: 40,
    fontSize: 14,
    lineHeight: 20,
  },
  lg: {
    dimension: 56,
    fontSize: 18,
    lineHeight: 24,
  },
  xl: {
    dimension: 80,
    fontSize: 28,
    lineHeight: 32,
  },
} as const;

export function Avatar({
  size = "md",
  initials = "AB",
  source,
  accessibilityLabel,
  style,
}: AvatarProps) {
  const config = sizeConfig[size];
  const isImage = Boolean(source);

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? (isImage ? "Avatar image" : `Avatar ${initials}`)}
      style={[
        styles.base,
        {
          width: config.dimension,
          height: config.dimension,
          borderRadius: config.dimension / 2,
        },
        !isImage && styles.initials,
        style,
      ]}
    >
      {isImage ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={source}
          style={[
            styles.image,
            {
              width: config.dimension,
              height: config.dimension,
              borderRadius: config.dimension / 2,
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize: config.fontSize,
              lineHeight: config.lineHeight,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    backgroundColor: colors.feedback.successBg,
  },
  initialsText: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontWeight: "600",
    color: colors.feedback.successFg,
  },
  image: {
    backgroundColor: colors.background.muted,
  },
});
