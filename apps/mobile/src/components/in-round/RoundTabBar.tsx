import { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon, colors, fontFamily, iconSize, spacing, type IconName } from "@kaddie/ui";
import { inRoundColors, inRoundLayout } from "../../round/inRoundTheme";
import type { RoundTab } from "../../round/types";

const PILL_WIDTH = 111;
const PILL_HEIGHT = 50;

type RoundTabBarProps = {
  activeTab: RoundTab;
  bottomInset?: number;
  onTabChange: (tab: RoundTab) => void;
};

const tabs: ReadonlyArray<{
  id: RoundTab;
  label: string;
  icon: IconName;
}> = [
  { id: "map", label: "Map", icon: "pin" },
  { id: "scorecard", label: "Scorecard", icon: "scorecard" },
  { id: "menu", label: "Menu", icon: "menu" },
];

function getPillOffset(rowWidth: number, activeIndex: number) {
  const tabWidth = rowWidth / tabs.length;
  return activeIndex * tabWidth + (tabWidth - PILL_WIDTH) / 2;
}

export function RoundTabBar({ activeTab, bottomInset = 0, onTabChange }: RoundTabBarProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const [rowWidth, setRowWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);

  const onTabsRowLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setRowWidth(width);
    }
  };

  useEffect(() => {
    if (rowWidth === 0 || activeIndex < 0) return;

    const targetX = getPillOffset(rowWidth, activeIndex);

    if (!hasAnimated.current) {
      translateX.setValue(targetX);
      hasAnimated.current = true;
      return;
    }

    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: true,
      tension: 120,
      friction: 14,
    }).start();
  }, [activeIndex, rowWidth, translateX]);

  return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      <View style={styles.tabsRow} onLayout={onTabsRowLayout}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activePill,
            {
              transform: [{ translateX }],
            },
          ]}
        />

        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onTabChange(tab.id)}
              style={styles.tabPressable}
            >
              <View style={styles.tabContent}>
                <Icon
                  color={inRoundColors.textInverse}
                  name={tab.icon}
                  size={iconSize.lg}
                />
                <Text style={styles.tabLabel}>{tab.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: inRoundColors.tabBarBackground,
    minHeight: inRoundLayout.tabBarHeight,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: spacing.xs,
    position: "relative",
  },
  activePill: {
    position: "absolute",
    top: spacing.xs,
    left: 0,
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    zIndex: 1,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    gap: spacing.xxs,
  },
  tabLabel: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.04,
    color: inRoundColors.textInverse,
    textAlign: "center",
  },
});
