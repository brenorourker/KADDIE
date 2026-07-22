import { useColors } from "../theme/Theme";
import { Icon } from "./Icon";

type IconGlyphProps = {
  color?: string;
  size?: number;
};

export function ChevronDown({ color, size = 24 }: IconGlyphProps) {
  const colors = useColors();
  return (
    <Icon name="chevron-down" color={color ?? colors.text.primary} size={size} />
  );
}

export function ChevronUp({ color, size = 24 }: IconGlyphProps) {
  const colors = useColors();
  return (
    <Icon name="chevron-up" color={color ?? colors.text.primary} size={size} />
  );
}

export function CheckIcon({ color, size = 24 }: IconGlyphProps) {
  const colors = useColors();
  return <Icon name="check" color={color ?? colors.text.primary} size={size} />;
}
