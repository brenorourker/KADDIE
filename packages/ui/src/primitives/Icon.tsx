import { View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { IconName, iconSources } from "../assets/icons/registry";
import { useColors } from "../theme/Theme";
import { iconSize } from "../tokens";

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
    .replace(/var\(--fill-0,\s*black\)/g, color)
    .replace(/preserveAspectRatio="none"/g, 'preserveAspectRatio="xMidYMid meet"');
}

export function Icon({
  name,
  size = iconSize.md,
  color,
  style,
}: IconProps) {
  const colors = useColors();
  const resolvedColor = color ?? colors.text.primary;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <SvgXml
        xml={prepareSvg(iconSources[name], resolvedColor)}
        width={size}
        height={size}
      />
    </View>
  );
}
