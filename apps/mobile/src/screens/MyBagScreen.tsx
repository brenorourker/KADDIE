import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Badge,
  Button,
  colors,
  controlSize,
  Icon,
  iconSize,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { usePersona } from "../personas/PersonaProvider";
import type { BagClub, BagSection } from "../personas/types";

type MyBagScreenProps = {
  onBack: () => void;
  onAddClub?: () => void;
  onOpenClubDetails?: (clubId: string) => void;
};

type ClubRowProps = {
  club: BagClub;
  isLast?: boolean;
  onPress: () => void;
};

const CLUB_THUMBNAIL_SIZE = 32;

type ThumbnailCrop = {
  left: number;
  scale: number;
  top: number;
};

const clubThumbnailCrops: Record<string, ThumbnailCrop> = {
  driver: {
    scale: 1.5283,
    left: -0.2874,
    top: -0.2642,
  },
  "2-iron": {
    scale: 1.4423,
    left: -0.2692,
    top: -0.1923,
  },
};

function ClubThumbnail({ clubId, source }: { clubId: string; source: BagClub["image"] }) {
  const crop = clubThumbnailCrops[clubId];
  const imageStyle = crop
    ? {
        height: CLUB_THUMBNAIL_SIZE * crop.scale,
        left: CLUB_THUMBNAIL_SIZE * crop.left,
        position: "absolute" as const,
        top: CLUB_THUMBNAIL_SIZE * crop.top,
        width: CLUB_THUMBNAIL_SIZE * crop.scale,
      }
    : styles.thumbnailImage;

  return (
    <View style={styles.thumbnail}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={source}
        style={imageStyle}
      />
    </View>
  );
}

function ClubRow({ club, isLast = false, onPress }: ClubRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
    >
      <ClubThumbnail clubId={club.id} source={club.image} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{club.title}</Text>
        <Text style={styles.rowModel}>{club.model}</Text>
      </View>
      <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
    </Pressable>
  );
}

function ClubCard({ club, onPress }: { club: BagClub; onPress: () => void }) {
  return (
    <View style={styles.card}>
      <ClubRow club={club} isLast onPress={onPress} />
    </View>
  );
}

function ClubGroup({
  clubs,
  onClubPress,
}: {
  clubs: BagClub[];
  onClubPress: (club: BagClub) => void;
}) {
  return (
    <View style={styles.card}>
      {clubs.map((club, index) => (
        <ClubRow
          key={club.id}
          club={club}
          isLast={index === clubs.length - 1}
          onPress={() => onClubPress(club)}
        />
      ))}
    </View>
  );
}

function ImportDistancesCard() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Import club distances. Coming soon."
      onPress={() =>
        Alert.alert(
          "Coming soon",
          "Third-party imports aren’t ready yet. You’ll be able to sync your distances from apps like Arccos, Shot Scope, and Garmin.",
        )
      }
      style={({ pressed }) => [
        styles.importCard,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.importIconWrap}>
        <Icon color={colors.text.secondary} name="preferences" size={iconSize.md} />
      </View>

      <View style={styles.rowText}>
        <View style={styles.importTitleRow}>
          <Text style={styles.rowTitle}>Import club distances</Text>
          <Badge color="info" label="Coming soon" type="status" />
        </View>
        <Text style={styles.rowModel}>
          Link Arccos, Shot Scope, or Garmin to fill in your bag automatically.
        </Text>
      </View>

      <Icon color={colors.text.primary} name="chevron-right" size={iconSize.md} />
    </Pressable>
  );
}

function BagSectionList({
  section,
  onClubPress,
}: {
  section: BagSection;
  onClubPress: (club: BagClub) => void;
}) {
  if (section.layout === "single") {
    const club = section.clubs[0];
    return <ClubCard club={club} onPress={() => onClubPress(club)} />;
  }

  return <ClubGroup clubs={section.clubs} onClubPress={onClubPress} />;
}

export function MyBagScreen({ onBack, onAddClub, onOpenClubDetails }: MyBagScreenProps) {
  const { bagData, bagClubCount } = usePersona();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + spacing.xl, spacing["2xl"] + spacing.lg);

  const handleClubPress = (club: BagClub) => {
    onOpenClubDetails?.(club.id);
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerBar}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.headerIconButton}
        >
          <Icon color={colors.text.primary} name="chevron-left" size={iconSize.lg} />
        </Pressable>

        <Text numberOfLines={1} style={styles.headerTitle}>
          My bag ({bagClubCount})
        </Text>

        <Button
          label="Add"
          leadingIcon={
            <Icon color={colors.action.onPrimary} name="plus" size={iconSize.sm} />
          }
          size="sm"
          onPress={onAddClub}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        style={styles.scroll}
      >
        <Text style={styles.intro}>{bagData.intro}</Text>

        {bagData.sections.map((section) => (
          <BagSectionList
            key={section.id}
            section={section}
            onClubPress={handleClubPress}
          />
        ))}

        <ImportDistancesCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.muted,
  },
  headerBar: {
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: controlSize.appBar,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerIconButton: {
    alignItems: "center",
    height: controlSize.md,
    justifyContent: "center",
    width: controlSize.md,
  },
  headerTitle: {
    ...typography.headingH3,
    color: colors.text.primary,
    flex: 1,
    minWidth: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  intro: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  card: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  rowPressed: {
    backgroundColor: colors.background.muted,
  },
  thumbnail: {
    backgroundColor: colors.background.surface,
    borderRadius: radii.sm,
    height: CLUB_THUMBNAIL_SIZE,
    overflow: "hidden",
    width: CLUB_THUMBNAIL_SIZE,
  },
  thumbnailImage: {
    height: CLUB_THUMBNAIL_SIZE,
    width: CLUB_THUMBNAIL_SIZE,
  },
  rowText: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  rowTitle: {
    ...typography.bodyDefault,
    color: colors.text.primary,
  },
  rowModel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  importCard: {
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  importIconWrap: {
    alignItems: "center",
    backgroundColor: colors.feedback.infoBg,
    borderRadius: radii.full,
    height: CLUB_THUMBNAIL_SIZE,
    justifyContent: "center",
    width: CLUB_THUMBNAIL_SIZE,
  },
  importTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
});
