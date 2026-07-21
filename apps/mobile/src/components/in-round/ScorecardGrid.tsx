import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontFamily, radii } from "@kaddie/ui";
import { getScoreMark, sumScores } from "../../round/services/scoreMarks";
import type { HoleData } from "../../round/types";
import { inRoundColors } from "../../round/inRoundTheme";

const CELL = 36;
const GAP = 2;
const SELECTED_GREEN = colors.action.primary;

type ScorecardGridProps = {
  holes: HoleData[];
  currentHoleNumber: number;
  scores: Readonly<Record<number, number | undefined>>;
  onSelectHole: (holeNumber: number) => void;
};

function HoleColumn({
  hole,
  score,
  selected,
  onPress,
}: {
  hole: HoleData;
  score: number | undefined;
  selected: boolean;
  onPress: () => void;
}) {
  const mark = score == null ? "none" : getScoreMark(score, hole.par);

  return (
    <Pressable
      accessibilityLabel={`Hole ${hole.number}, par ${hole.par}${
        score == null ? "" : `, score ${score}`
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.column}
    >
      <View style={[styles.headerCell, selected && styles.headerCellSelected]}>
        <Text style={[styles.headerText, selected && styles.headerTextSelected]}>
          {hole.number}
          {"\n"}
          {hole.par}
        </Text>
      </View>
      <View style={styles.scoreCell}>
        {score != null ? (
          <View
            style={[
              styles.scoreMark,
              mark === "bogey" && styles.scoreMarkBogey,
              mark === "double" && styles.scoreMarkDouble,
              mark === "under" && styles.scoreMarkUnder,
            ]}
          >
            <Text
              style={[
                styles.scoreText,
                (mark === "double" || mark === "under") && styles.scoreTextOnFill,
              ]}
            >
              {score}
            </Text>
          </View>
        ) : null}
      </View>
      {selected ? <View style={styles.caret} /> : <View style={styles.caretSpacer} />}
    </Pressable>
  );
}

function TotalColumn({
  label,
  total,
}: {
  label: string;
  total: number | null;
}) {
  return (
    <View style={styles.column}>
      <View style={styles.headerCell}>
        <Text style={styles.totalLabel}>{label}</Text>
      </View>
      <View style={styles.scoreCell}>
        {total != null ? <Text style={styles.totalValue}>{total}</Text> : null}
      </View>
      <View style={styles.caretSpacer} />
    </View>
  );
}

export function ScorecardGrid({
  holes,
  currentHoleNumber,
  scores,
  onSelectHole,
}: ScorecardGridProps) {
  const front = holes.filter((hole) => hole.number <= 9);
  const back = holes.filter((hole) => hole.number >= 10);
  const outTotal = sumScores(
    scores,
    front.map((hole) => hole.number),
  );
  const inTotal = sumScores(
    scores,
    back.map((hole) => hole.number),
  );

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        {front.map((hole) => (
          <HoleColumn
            key={hole.number}
            hole={hole}
            score={scores[hole.number]}
            selected={hole.number === currentHoleNumber}
            onPress={() => onSelectHole(hole.number)}
          />
        ))}
        <TotalColumn label="OUT" total={outTotal} />
      </View>
      <View style={styles.row}>
        {back.map((hole) => (
          <HoleColumn
            key={hole.number}
            hole={hole}
            score={scores[hole.number]}
            selected={hole.number === currentHoleNumber}
            onPress={() => onSelectHole(hole.number)}
          />
        ))}
        <TotalColumn label="IN" total={inTotal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 8,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  column: {
    width: CELL,
    alignItems: "center",
  },
  headerCell: {
    width: CELL,
    height: CELL,
    backgroundColor: colors.action.onDisabled,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCellSelected: {
    backgroundColor: SELECTED_GREEN,
  },
  headerText: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
    color: colors.text.primary,
    textAlign: "center",
  },
  headerTextSelected: {
    color: colors.action.onPrimary,
  },
  totalLabel: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
    color: colors.text.primary,
    textAlign: "center",
  },
  scoreCell: {
    width: CELL,
    height: CELL,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreMark: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreMarkBogey: {
    borderWidth: 1.5,
    borderColor: colors.text.primary,
  },
  scoreMarkDouble: {
    backgroundColor: inRoundColors.background,
  },
  scoreMarkUnder: {
    backgroundColor: colors.action.destructive,
  },
  scoreText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
  },
  scoreTextOnFill: {
    color: inRoundColors.textInverse,
  },
  totalValue: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
  },
  caret: {
    marginTop: 4,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: SELECTED_GREEN,
  },
  caretSpacer: {
    height: 11,
  },
});
