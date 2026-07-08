import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, fontFamily, iconSize, spacing, typography } from "@kaddie/ui";
import { useRoundMap } from "../../round/RoundMapProvider";
import { getInRoundHeaderLayout, inRoundColors } from "../../round/inRoundTheme";

export function HoleHeader() {
  const insets = useSafeAreaInsets();
  const headerLayout = getInRoundHeaderLayout(insets.top);
  const { currentHole, holes, goToPreviousHole, goToNextHole } = useRoundMap();

  const canGoBack = holes.length > 1;
  const canGoForward = holes.length > 1;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: headerLayout.paddingTop,
          height: headerLayout.height,
        },
      ]}
    >
      <View style={[styles.body, { height: headerLayout.bodyHeight }]}>
        <Pressable
          accessibilityLabel="Previous hole"
          accessibilityRole="button"
          disabled={!canGoBack}
          hitSlop={8}
          onPress={goToPreviousHole}
          style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
        >
          <Icon
            color={inRoundColors.textInverse}
            name="chevron-left"
            size={iconSize.lg}
          />
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.holeLabel}>HOLE {currentHole.number}</Text>
          <Text style={styles.meta}>
            Par: {currentHole.par}      Yds: {currentHole.yardage}      Hcp:{" "}
            {currentHole.strokeIndex}
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Next hole"
          accessibilityRole="button"
          disabled={!canGoForward}
          hitSlop={8}
          onPress={goToNextHole}
          style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
        >
          <Icon
            color={inRoundColors.textInverse}
            name="chevron-right"
            size={iconSize.lg}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: inRoundColors.background,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingBottom: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  center: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xxs,
  },
  holeLabel: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
  meta: {
    ...typography.bodyDefault,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
});
