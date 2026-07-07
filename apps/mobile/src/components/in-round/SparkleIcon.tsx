import Svg, { Path } from "react-native-svg";

type SparkleIconProps = {
  color?: string;
  size?: number;
};

export function SparkleIcon({ color = "#FFFFFF", size = 24 }: SparkleIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M12.2028 1.81177C14.5803 7.52266 16.4919 9.43421 22.2028 11.8118C16.4919 14.1893 14.5803 16.1009 12.2028 21.8118C9.8252 16.1009 7.91365 14.1893 2.20276 11.8118C7.91365 9.43421 9.8252 7.52266 12.2028 1.81177Z"
        fill={color}
      />
      <Path
        d="M19.3365 1.79028C20.0248 3.43423 20.5804 3.98984 22.2028 4.65649C20.5588 5.34476 20.0032 5.90031 19.3365 7.52271C18.6483 5.87872 18.0927 5.32315 16.4703 4.65649C18.1143 3.96824 18.6699 3.41264 19.3365 1.79028Z"
        fill={color}
      />
    </Svg>
  );
}
