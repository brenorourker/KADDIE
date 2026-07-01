import {
  Avatar,
  avatarPlaceholderImage,
  AvatarSize,
  colors,
  spacing,
  typography,
} from "@kaddie/ui";
import { StyleSheet, Text, View } from "react-native";
import { PlaygroundScreen, VariantRow } from "../PlaygroundLayout";

const sizes: { id: AvatarSize; label: string }[] = [
  { id: "sm", label: "Small (32px)" },
  { id: "md", label: "Medium (40px)" },
  { id: "lg", label: "Large (56px)" },
  { id: "xl", label: "Extra large (80px)" },
];

export function AvatarPlayground({ onBack }: { onBack: () => void }) {
  return (
    <PlaygroundScreen title="Avatar" onBack={onBack}>
      <VariantRow label="Initials">
        <View style={styles.row}>
          {sizes.map((size) => (
            <View key={`initials-${size.id}`} style={styles.cell}>
              <Avatar initials="AB" size={size.id} />
              <Text style={styles.label}>{size.label}</Text>
            </View>
          ))}
        </View>
      </VariantRow>

      <VariantRow label="Image">
        <View style={styles.row}>
          {sizes.map((size) => (
            <View key={`image-${size.id}`} style={styles.cell}>
              <Avatar size={size.id} source={avatarPlaceholderImage} />
              <Text style={styles.label}>{size.label}</Text>
            </View>
          ))}
        </View>
      </VariantRow>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    alignItems: "flex-end",
  },
  cell: {
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 88,
  },
  label: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: "center",
  },
});
