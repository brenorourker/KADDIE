import { View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { IconName, iconSources } from "../assets/icons/registry";
import { colors, iconSize } from "../tokens";

export type { IconName } from "../assets/icons/registry";
export { iconNames } from "../assets/icons/registry";

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

function prepareSvg(svg: string, color: string) {
  return svg
    .replace(/<g[^>]*>/g, "")
    .replace(/<\/g>/g, "")
    .replace(/var\(--fill-0,\s*black\)/g, color)
    .replace(/preserveAspectRatio="none"/g, 'preserveAspectRatio="xMidYMid meet"');
}

export function Icon({
  name,
  size = iconSize.md,
  color = colors.text.primary,
  style,
}: IconProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size }, style]}
    >
      <SvgXml
        xml={prepareSvg(iconSources[name], color)}
        width={size}
        height={size}
      />
    </View>
  );
}
