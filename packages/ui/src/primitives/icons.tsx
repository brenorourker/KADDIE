import { colors } from "../tokens";
import { Icon } from "./Icon";

type IconGlyphProps = {
  color?: string;
  size?: number;
};

export function ChevronDown({
  color = colors.text.primary,
  size = 24,
}: IconGlyphProps) {
  return <Icon name="chevron-down" color={color} size={size} />;
}

export function ChevronUp({
  color = colors.text.primary,
  size = 24,
}: IconGlyphProps) {
  return <Icon name="chevron-up" color={color} size={size} />;
}

export function CheckIcon({
  color = colors.text.primary,
  size = 24,
}: IconGlyphProps) {
  return <Icon name="check" color={color} size={size} />;
}
