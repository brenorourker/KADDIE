import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar, colors, radii, spacing, typography } from "@kaddie/ui";
import { coachingStrategyCards } from "./coachingMockData";

type CoachingStrategyScreenProps = {
  onBack: () => void;
};

export function CoachingStrategyScreen({ onBack }: CoachingStrategyScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  return (
    <View style={styles.root}>
      <AppBar title="Course strategy" onLeadingPress={onBack} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Elmgreen Golf Club</Text>
          <Text style={styles.introBody}>
            Hole-by-hole strategy based on your miss patterns and scoring history at this
            course.
          </Text>
        </View>

        <View style={styles.cardList}>
          {coachingStrategyCards.map((card) => (
            <View key={card.id} style={styles.strategyCard}>
              <Text style={styles.hole}>{card.hole}</Text>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.situation}>{card.situation}</Text>
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationLabel}>STRATEGY</Text>
                <Text style={styles.recommendation}>{card.recommendation}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statText}>{card.stat}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.muted,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  intro: {
    gap: spacing.xs,
  },
  introTitle: {
    ...typography.headingH2,
    color: colors.text.primary,
  },
  introBody: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  cardList: {
    gap: spacing.md,
  },
  strategyCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  hole: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: "uppercase",
  },
  title: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  situation: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
  recommendationBox: {
    backgroundColor: colors.feedback.successBg,
    borderRadius: radii.sm,
    gap: spacing.xxs,
    padding: spacing.md,
  },
  recommendationLabel: {
    ...typography.caption,
    color: colors.feedback.successFg,
    textTransform: "uppercase",
  },
  recommendation: {
    ...typography.bodyDefault,
    color: colors.feedback.successFg,
  },
  statPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.background.muted,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
  },
  statText: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
});
