import { useEffect, useMemo, useState } from "react";
import {
  Chip,
  IconName,
  ToggleButton,
  ToggleButtonOption,
  ToggleButtonVariant,
} from "@kaddie/ui";
import { StyleSheet } from "react-native";
import {
  ConfigPanel,
  ConfigRow,
  PlaygroundScreen,
  VariantRow,
} from "../PlaygroundLayout";

const segmentLabels = ["Overview", "Specs", "Compare", "Trade"] as const;
const segmentIcons: IconName[] = ["home", "settings", "target-1", "flag"];

type SegmentCount = 2 | 3 | 4;

function buildOptions(
  segments: SegmentCount,
  showIcons: boolean,
): ToggleButtonOption[] {
  return segmentLabels.slice(0, segments).map((label, index) => ({
    label,
    icon: showIcons ? segmentIcons[index] : undefined,
  }));
}

export function ToggleButtonPlayground({ onBack }: { onBack: () => void }) {
  const [variant, setVariant] = useState<ToggleButtonVariant>("pill");
  const [segments, setSegments] = useState<SegmentCount>(2);
  const [showIcons, setShowIcons] = useState(false);
  const [value, setValue] = useState(0);

  const options = useMemo(
    () => buildOptions(segments, showIcons),
    [segments, showIcons],
  );

  useEffect(() => {
    if (value >= segments) {
      setValue(0);
    }
  }, [segments, value]);

  return (
    <PlaygroundScreen title="Toggle Button" onBack={onBack}>
      <VariantRow label="Preview">
        <ToggleButton
          options={options}
          value={value}
          onValueChange={setValue}
          variant={variant}
          style={styles.toggle}
        />
      </VariantRow>

      <ConfigPanel>
        <ConfigRow label="Type">
          <Chip
            label="Pill"
            selected={variant === "pill"}
            onPress={() => setVariant("pill")}
          />
          <Chip
            label="Filled"
            selected={variant === "filled"}
            onPress={() => setVariant("filled")}
          />
        </ConfigRow>

        <ConfigRow label="Segments">
          <Chip
            label="2"
            selected={segments === 2}
            onPress={() => setSegments(2)}
          />
          <Chip
            label="3"
            selected={segments === 3}
            onPress={() => setSegments(3)}
          />
          <Chip
            label="4"
            selected={segments === 4}
            onPress={() => setSegments(4)}
          />
        </ConfigRow>

        <ConfigRow label="Icons">
          <Chip
            label="Yes"
            selected={showIcons}
            onPress={() => setShowIcons(true)}
          />
          <Chip
            label="No"
            selected={!showIcons}
            onPress={() => setShowIcons(false)}
          />
        </ConfigRow>
      </ConfigPanel>
    </PlaygroundScreen>
  );
}

const styles = StyleSheet.create({
  toggle: {
    alignSelf: "stretch",
  },
});
