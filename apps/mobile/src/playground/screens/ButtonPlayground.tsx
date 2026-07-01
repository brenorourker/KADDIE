import { useMemo, useState } from "react";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Chip,
  Icon,
  colors,
  iconSize,
} from "@kaddie/ui";
import { StyleSheet, Text, View } from "react-native";
import {
  ConfigPanel,
  ConfigRow,
  PlaygroundScreen,
  VariantRow,
} from "../PlaygroundLayout";

const variants: { id: ButtonVariant; label: string }[] = [
  { id: "primary", label: "Primary" },
  { id: "secondary", label: "Secondary" },
  { id: "ghost", label: "Ghost" },
  { id: "destructive", label: "Destructive" },
];

const iconOnlyByVariant = {
  primary: "plus",
  secondary: "search",
  ghost: "more",
  destructive: "close",
} as const;

const buttonIconSize: Record<ButtonSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
};

function iconColor(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return colors.action.onPrimary;
    case "secondary":
      return colors.action.onSecondary;
    case "ghost":
      return colors.action.onGhost;
    case "destructive":
      return colors.action.onDestructive;
  }
}

type PreviewButtonProps = {
  variant: ButtonVariant;
  size: ButtonSize;
  showLabel: boolean;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

function PreviewButton({
  variant,
  size,
  showLabel,
  showLeadingIcon,
  showTrailingIcon,
}: PreviewButtonProps) {
  const iconOnly = !showLabel;
  const iconPx = buttonIconSize[size];
  const color = iconColor(variant);

  const leadingIcon =
    showLeadingIcon || iconOnly ? (
      <Icon
        color={color}
        name={iconOnly ? iconOnlyByVariant[variant] : "plus"}
        size={iconPx}
      />
    ) : undefined;

  const trailingIcon =
    showTrailingIcon && showLabel ? (
      <Icon color={color} name="chevron-right" size={iconPx} />
    ) : undefined;

  return (
    <Button
      iconOnly={iconOnly}
      label="Continue"
      leadingIcon={leadingIcon}
      size={size}
      trailingIcon={trailingIcon}
      variant={variant}
      onPress={() => undefined}
    />
  );
}

export function ButtonPlayground({ onBack }: { onBack: () => void }) {
  const [size, setSize] = useState<ButtonSize>("md");
  const [showLabel, setShowLabel] = useState(true);
  const [showLeadingIcon, setShowLeadingIcon] = useState(false);
  const [showTrailingIcon, setShowTrailingIcon] = useState(false);

  const effectiveLeadingIcon = useMemo(
    () => (showLabel ? showLeadingIcon : true),
    [showLabel, showLeadingIcon],
  );

  return (
    <PlaygroundScreen title="Button" onBack={onBack}>
      <VariantRow label="Preview">
        <View style={styles.previewStack}>
          {variants.map((variant) => (
            <View key={variant.id} style={styles.previewRow}>
              <Text style={styles.previewLabel}>{variant.label}</Text>
              <PreviewButton
                showLabel={showLabel}
                showLeadingIcon={effectiveLeadingIcon}
                showTrailingIcon={showTrailingIcon}
                size={size}
                variant={variant.id}
              />
            </View>
          ))}
        </View>
      </VariantRow>

      <ConfigPanel>
        <ConfigRow label="Size">
          <Chip
            label="Small"
            selected={size === "sm"}
            onPress={() => setSize("sm")}
          />
          <Chip
            label="Medium"
            selected={size === "md"}
            onPress={() => setSize("md")}
          />
          <Chip
            label="Large"
            selected={size === "lg"}
            onPress={() => setSize("lg")}
          />
        </ConfigRow>

        <ConfigRow label="Label">
          <Chip
            label="Yes"
            selected={showLabel}
            onPress={() => setShowLabel(true)}
          />
          <Chip
            label="No"
            selected={!showLabel}
            onPress={() => setShowLabel(false)}
          />
        </ConfigRow>

        <ConfigRow label="Leading icon">
          <Chip
            label="Yes"
            disabled={!showLabel}
            selected={showLabel && showLeadingIcon}
            onPress={() => setShowLeadingIcon(true)}
          />
          <Chip
            label="No"
            disabled={!showLabel}
            selected={showLabel && !showLeadingIcon}
            onPress={() => setShowLeadingIcon(false)}
          />
        </ConfigRow>

        <ConfigRow label="Trailing icon">
          <Chip
            label="Yes"
            disabled={!showLabel}
            selected={showLabel && showTrailingIcon}
            onPress={() => setShowTrailingIcon(true)}
          />
          <Chip
            label="No"
            disabled={!showLabel}
            selected={showLabel && !showTrailingIcon}
            onPress={() => setShowTrailingIcon(false)}
          />
        </ConfigRow>
      </ConfigPanel>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  previewStack: {
    gap: 12,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewLabel: {
    width: 96,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
